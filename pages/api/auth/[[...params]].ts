
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
  signInWithEmailAndPassword,
  User,
} from "firebase/auth"

// dto
import { CreateUserDto } from "../users/dto/create-user.dto"
import { LoginDTO } from "@/pages/api/auth/dto/login.dto"

// services
import { NotificationsService } from "@/pages/api/notifications/[[...params]]"
import { UserService } from "@/pages/api/users/[[...params]]"

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
import {
  // const
  DEFAULT_REGION,
  REGION_NOT_FOUND_ERROR_MSG,
  REGIONS_NAMES,

  // lib
  firebaseAuth,
} from '@/entities/Region'

import { getFirestoreAdmin } from '@/entities/Region/lib/firebase/firebaseAdmin'
import {
  // api
  createNotification,
  notifyEmployees,
} from "@/entities/Notification"

// shared
import { TFixMeInTheFuture } from "@/shared/types/types"
import { getLogger } from "@/shared/lib/logger/log-util"

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
        await Promise.all(REGIONS_NAMES.map(async (region, index) => {
          const userRes = await findUserInRegion(REGIONS_NAMES, user.uid, index)
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

  // services
  private readonly notificationsService: NotificationsService
  private readonly userService: UserService

  constructor() {
    this.notificationsService = new NotificationsService()
    this.userService = new UserService()
  }

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
          refreshToken: null,
          region: userInDB.country
        }
      }
    } catch (error) {
      console.error(`login error: ${error}`)
    }
  }

  async register(dto: CreateUserDto) {
    try {
      const regionAcceptable = dto.country ? REGIONS_NAMES.includes(dto.country) : false
      if (!regionAcceptable) throw new BadRequestException(REGION_NOT_FOUND_ERROR_MSG)

      const userCountry = dto.country as string

      const defaultFbInstance = await getFirestoreAdmin(DEFAULT_REGION)
      const fbInstance = typeof userCountry === "string"
        ? await getFirestoreAdmin(userCountry) // get region instance
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
        country: userCountry,
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
      }).then((tokens) => {
        // create notification for new user
        const welcomeNotificationTitle = 'Добро пожаловать'
        const welcomeNotificationText = 'Это ваш личный кабинет, где будет обновляться информация о ваших грузах.'
        const welcomeNotification = createNotification({
          country: userCountry,
          token: tokens?.accessToken as string,
          body: {
            userId: userId,
            title: welcomeNotificationTitle,
            content: welcomeNotificationText
          }
        })
        console.log('registration welcomeNotification', { welcomeNotification })

        notifyEmployees({
          country: userCountry,
          token: tokens?.accessToken as string,
          body: {
            userName: dto.name,
            userEmail: dto.email,
            userPhone: dto.phone,
            userPassword: dto.password,
          }
        })
      })

      return {
        user: {
          firebaseAuth: fbUser,
          ...user,
        },
        tokens: tokens
      }
    } catch (error) {
      console.error(`register error: ${error}`)

      exceptionsAdapter(error)
    }
  }

  async refreshToken(token: string, country: string) {
    console.log('refreshToken', { token, country })
    try {
      const defaultFbInstance = await getFirestoreAdmin(DEFAULT_REGION)
      const auth = defaultFbInstance.auth()
      if (!auth) throw new InternalServerErrorException('Something wrong with auth')
      const currentFirebaseUser = await getUserByCustomToken(token)

      const userId = currentFirebaseUser.uid

      const userInDB = await getUserInRegion(country, userId)
      console.log({userInDB})
      if (userInDB === null) throw new NotFoundException(`User not found in database`)

      const { id, ...notSensitiveData } = userInDB

      if (!notSensitiveData?.country) throw new NotFoundException(`'country' of User not found in user data`)

      const developerClaims: IUserOfDB = {
        //... add other custom claims as need be
        id: userId,
        ...notSensitiveData
      }
      const accessToken = await auth.createCustomToken(userId, developerClaims)

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
