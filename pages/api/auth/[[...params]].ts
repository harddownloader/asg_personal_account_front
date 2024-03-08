import {
  BadRequestException,
  Body,
  createHandler,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req
} from "next-api-decorators"
import {
  signInWithCustomToken,
  signInWithEmailAndPassword,
  getAuth,
  User,
  UserCredential,
} from "firebase/auth"

// dto
import { CreateUserDto } from "../users/dto/create-user.dto"
import { LoginDTO } from "@/pages/api/auth/dto/login.dto"


// lib
import { getUserByCustomToken } from "@/pages/api/_lib/getUserByCustomToken"
import { endpointCatchHandler, exceptionsAdapter } from "@/pages/api/_core/endpoint-catch-handler"
import { JwtToken } from "@/pages/api/_decoracors/token"
import { Ip } from "../_decoracors/ip"
import { JwtAuthGuard } from "@/pages/api/_middleware/jwt-auth.guard"


// entities
import {
  // const
  USER_ROLE,
  USERS_DB_COLLECTION_NAME,

  // types
  IUserOfDB,

  // api - mappers
  mapUserDataFromApi,
} from "@/entities/User"
import {DEFAULT_REGION, REGIONS} from '@/entities/Region'

// shared
import { TFixMeInTheFuture } from "@/shared/types/types"
import { getLogger } from "@/shared/lib/logger/log-util"
import {firebaseAdmin, fApp, getFirestoreAdmin, sApp, tApp} from "@/shared/lib/firebase/firebaseAdmin"
import { firebaseAuth } from "@/shared/lib/firebase"

const getUserInRegion = async (regionName: string, userId: string): Promise<IUserOfDB | null> => {
   try {
     const userByFirstRegion = await getFirestoreAdmin(regionName)
       .firestore()
       .collection(USERS_DB_COLLECTION_NAME)
       .doc(userId)
       .get()
       .then((user: TFixMeInTheFuture) => {
         const userDecode = {...user.data()}

         return userDecode?.id ? mapUserDataFromApi(userDecode) : null
       })
       .catch((error: TFixMeInTheFuture) => {
         console.error('getUserFromDB error:', error)
         return null
       })

     return userByFirstRegion
   } catch (error) {
     console.error(`getUserInRegion error: ${error}`)
     return null
   }
}

const findUserInRegion = async (
  regions: string[],
  userId: string,
  regionIndex: number = 0,
): Promise<IUserOfDB | null> => {
  try {
    const userByFirstRegion = await getUserInRegion(regions[regionIndex], userId)

    if (userByFirstRegion) return userByFirstRegion
    else if (regions.length-1 >= regionIndex) return null
    else return await findUserInRegion(
        regions,
        userId,
        regionIndex + 1
      )
  } catch (error) {
    console.error(`findUserInRegion error: ${error}`)
    return null
  }
}

const getUserInAuth = async (
  email: string,
  password: string
): Promise<{user: User, userInDB: IUserOfDB} | void>  => {
  try {
    return await signInWithEmailAndPassword(firebaseAuth, email, password)
      .then(async (userCredential) => {
        console.log('into signInWithEmailAndPassword')
        // Signed in
        const user = userCredential.user

        // loop
        let userInDB: IUserOfDB | null = null //= await findUserInRegion(REGIONS, user.uid)
        await Promise.all(REGIONS.map(async (region, index) => {
          const userRes = await findUserInRegion(REGIONS, user.uid, index)
          if (userRes) userInDB = userRes
        }))

        if (!userInDB) throw new NotFoundException(`User not found in database`)

        return { user, userInDB }
      }).catch((error) => {
        console.log('getUserInAuth catch')
        throw new NotFoundException(`User not found. Code: ${error.code}, message: ${error.message}`)
      })
  } catch (error) {
    console.error(`getUserInAuth error: ${error}`)
  }
}

class AuthService {
  protected readonly logger = getLogger(AuthService.name)

  public async login({ email, password }: LoginDTO) {
    try {
      console.log('login')
      const auth = await getFirestoreAdmin(DEFAULT_REGION).auth()

      this.logger.info({ cred: { email, password } })

      const userInAuth = await getUserInAuth(email, password)

      if (!userInAuth) {
        throw new NotFoundException(`User not found in database. Check your auth`)
      }

      const { user, userInDB } = userInAuth

      if (userInDB === null) throw new NotFoundException(`User not found in database`)

      const userId = user.uid

      {
        const { id, ...notSensitiveData } = userInDB
        const accessToken = await auth.createCustomToken(userId, {
          //... add other custom claims as need be
          id: userId,
          ...notSensitiveData
        })

        return {
          accessToken: accessToken,
          refreshToken: null
        }
      }
    } catch (error) {
      console.error(`login error: ${error}`)
    }
  }

  async register(dto: CreateUserDto) {
    try {
      const defaultFbInstance = await getFirestoreAdmin(DEFAULT_REGION)
      const fbInstance = typeof dto.country === "string"
        ? await getFirestoreAdmin(dto.country) // get region instance
        : defaultFbInstance // get default instance

      const fbAuth = await defaultFbInstance.auth()
      const fbUser = fbAuth
        .createUser({
          email: dto.email,
          emailVerified: true,
          password: dto.password,
          displayName: dto.name,
          disabled: false,
          phoneNumber: dto.phone,
        }).catch((error) => {
          console.error('register.createUser error:', { error })
          throw new BadRequestException(error.message, [error])
        })

      // if (!fbUser) throw new BadRequestException('user wasnt created', [])

      const db = await fbInstance.firestore()
      const usersRef = await db.collection(USERS_DB_COLLECTION_NAME)

      const userId = (await fbUser).uid
      const user = {
        id: userId,
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        userCodeId: null,
        city: null,
        country: dto.country,
        role: USER_ROLE.CLIENT
      }
      await usersRef
        .doc(userId)
        .set({
          ...user,
        })
        .then(() => user)
        .catch((error) => {
          console.error(error)
        })

      const tokens = await this.login({
        email: dto.email,
        password: dto.password
      })

      return {
        user: {...fbUser},
        tokens: tokens
      }
    } catch (error) {
      console.error(`register error: ${error}`)

      exceptionsAdapter(error)
    }
  }

  async refreshToken(token: string, country: string) {
    try {
      const auth = await getAuth()
      if (!auth) throw new InternalServerErrorException('Something wrong with auth')
      const currentFirebaseUser: User = await getUserByCustomToken(auth, token)

      const userId = currentFirebaseUser.uid

      const userInDB = await getUserInRegion(country, userId)
      console.log({userInDB})
      if (userInDB === null) throw new NotFoundException(`User not found in database`)

      const { id, ...notSensitiveData } = userInDB

      if (!notSensitiveData?.country) throw new NotFoundException(`'country' of User not found in user data`)
      const dbInstance = await getFirestoreAdmin(notSensitiveData.country)

      const developerClaims: IUserOfDB = {
        //... add other custom claims as need be
        id: userId,
        ...notSensitiveData
      }
      const accessToken = await firebaseAdmin.auth(dbInstance).createCustomToken(userId, developerClaims)

      return {
        accessToken: accessToken,
        refreshToken: null
      }
    } catch (error) {
      console.error(`refreshToken error: ${error}`)
      return null
    }
  }

  async logout(token: string) {
    // const auth = await getAuth()
    // if (!auth) throw new InternalServerErrorException('Something wrong with auth of current user')
    // if (!auth.currentUser) throw new ForbiddenException('User already logged out')
    //
    // return await auth.signOut()
    //   .then(() => {
    //     return 'user successfully logged out'
    //   })
    //   .catch((error) => {
    //     return 'something went wrong with sign out of user!'
    //   })
  }

  async revokeToken(userId: string) {
    // Revoke all refresh tokens for a specified user for whatever reason.
    // Retrieve the timestamp of the revocation, in seconds since the epoch.
    // return getAuth()
    //   .revokeRefreshTokens(userId)
    //   .then(() => {
    //     return getAuth().getUser(userId);
    //   })
    //   .then((userRecord) => {
    //     // @ts-ignore
    //     return new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
    //   })
    //   .then((timestamp) => {
    //     return `Tokens revoked at: ${timestamp}`
    //   });
  }
}

class AuthController {
  private readonly authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  @Post('/register/:country')
  public async register(
    @Param('country') country: string,
    @Ip() ip: string,
    @Body() dto: CreateUserDto
  ) {
    return await this.authService.register(dto)
  }

  @Post('/signin')
  public async login(@Body() body: LoginDTO) {
    return await this.authService.login(body)
  }

  @Get('/refresh/:country')
  public refreshToken(
    @JwtToken() token: string,
    @Param('country') country: string,
  ) {
    return this.authService.refreshToken(token, country);
  }

  // @UseGuards(AccessTokenGuard)
  @Get('/logout')
  public logout(
    // @Req() req: Request
    @JwtToken() token: string,
  ) {
    return this.authService.logout(token);
  }

  @Get('/revoke/:userId')
  public revokeToken(@Param('userId') userId: string) {
    return this.authService.revokeToken(userId);
  }
}

export default createHandler(AuthController)
