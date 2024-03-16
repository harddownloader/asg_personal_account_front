import {
  Body,
  createHandler,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  ValidationPipe,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Res,
} from 'next-api-decorators'
import { firebaseAdmin, getFirestoreAdmin } from "@/shared/lib/firebase/firebaseAdmin"
import { User } from "@firebase/auth"
import { getAuth, signInWithCustomToken } from "firebase/auth"
import { USERS_DB_COLLECTION_NAME, USER_ROLE } from '@/entities/User'
import type { IUserOfDB } from "@/entities/User"
import { Ip } from "../_decoracors/ip"
import { CreateUserDto } from "./dto/create-user.dto"
import { ChangeUserRegionDto } from "./dto/change-user-region.dto"
import { UpdateUserDto } from "@/pages/api/users/dto/update-user.dto"
import type { TCountryArg, TIdArg } from "@/pages/api/users/types"
import { JwtToken } from "../_decoracors/token"
import { TFixMeInTheFuture } from "@/shared/types/types"
import { mapUserDataFromApi } from "@/entities/User"

import { JwtAuthGuard } from "@/pages/api/_middleware/jwt-auth.guard"
import { getUserByCustomToken } from '../_lib/getUserByCustomToken'
import { endpointCatchHandler } from "@/pages/api/_core/endpoint-catch-handler"
import { DEFAULT_REGION } from "@/entities/Region"
import {DecodedIdToken} from "firebase-admin/lib/auth/token-verifier";
import {isTokenExpire} from "@/shared/lib/token";

// @Controller('users')
export class UserControllerForAdmins {
  protected readonly userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  @Patch('/change-users-region/:currentCountry/:id')
  changeUserRegion(
    @Param('currentCountry') currentCountry: TCountryArg,
    @Param('id') id: TIdArg,
    @Body() changeUserRegionDto: ChangeUserRegionDto
  ) {
    return this.userService.changeUserRegion(currentCountry, id, changeUserRegionDto);
  }

  @Get('/managers/all/:country')
  getAllManagersOfRegion(
    @Param('country') country: string,
  ) {
    return this.userService.getAllManagersOfRegion(country);
  }

  @Get('/clients/all/:country')
  getAllClientsOfRegion(
    @Param('country') country: string,
  ) {
    return this.userService.getAllClientsOfRegion(country);
  }

  @Get('/admins/all/:country')
  getAllAdminsOfRegion(
    @Param('country') country: string,
  ) {
    return this.userService.getAllAdminsOfRegion(country);
  }
}

class UserController extends UserControllerForAdmins {
  protected readonly userService: UserService

  constructor() {
    super()
    this.userService = new UserService()
  }

  // @Post() //'/:country'
  // // @UsePipes(new ValidationPipe({ transform: true }))
  // create(
  //   @Param('country') country: string,
  //   @Ip() ip: any,
  //   @Body(ValidationPipe) createUserDto: CreateUserDto
  // ) {
  //   // return {ip, createUserDto}
  //   return this.userService.create(country, ip, createUserDto);
  // }
  //
  // @Get('/:country')
  // findAll(@Param('country') country: string) {
  //   return this.userService.findAll(country);
  // }
  //
  // // @UsePipes(new ValidationPipe())
  @Get('/:country/:id')
  findOne(
    @Param('country') country: string,
    @Param('id') id: string
  ) {
    return this.userService.findOne(country, id);
  }
  //
  // // @UsePipes(new ValidationPipe())
  // @Get('/findOneByEmail/:country/:email')
  // findOneByEmail(
  //   @Param('country') country: string,
  //   @Param('email') email: string
  // ) {
  //   return this.userService.findOneByEmail(country, email);
  // }

  @JwtAuthGuard()
  @Get('/me/:country/:userId')
  getMe(
    @Param('country') country: string,
    @Param('userId') userId: string,
    @JwtToken() token: string,
  ) {
    return this.userService.getMe(country, token)
  }

  @Patch('/:country/:id')
  update(
    @Res() response: Response,
    @Param('country') country: string,
    @Param('id') id: string,
    @JwtToken() token: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(country, id, token, updateUserDto, response);
  }
  //
  // @Delete('/:country/:id')
  // remove(
  //   @Param('country') country: string,
  //   @Param('id'
  //   ) id: string) {
  //   return this.userService.remove(country, id);
  // }
}

export class UserService {
  async create(
    country: string,
    ip: string,
    createUserDto: CreateUserDto
  ) {
    return 'create'
  }

  async findAll(country: string) {}

  async getAllClientsOfRegion(country: string) {
    try {
      const db = await getFirestoreAdmin(country).firestore()
      const usersRef = await db.collection(USERS_DB_COLLECTION_NAME)
      const clients = await usersRef
        .where("role", "==", USER_ROLE.CLIENT)
        .get()
        .then((clients: TFixMeInTheFuture) => {
          return clients.docs.map((client: TFixMeInTheFuture) => {
            const clientDecode = {...client.data()}

            return clientDecode?.id ? mapUserDataFromApi(clientDecode) : null
          })
        })

      return clients
    } catch (error) {
      console.error(`getAllClientsOfRegion error: ${error}`)
      return null
    }
  }

  async getAllManagersOfRegion(country: string) {
    try {
      const db = await getFirestoreAdmin(country).firestore()
      const usersRef = await db.collection(USERS_DB_COLLECTION_NAME)

      return await usersRef
        .where("role", "==", USER_ROLE.MANAGER)
        .get()
        .then((users: TFixMeInTheFuture) => {
          return users.docs.map((client: TFixMeInTheFuture) => {
            const userDecode = {...client.data()}

            return userDecode?.id ? mapUserDataFromApi(userDecode) : null
          })
        })
    } catch (error) {
      console.error(`getAllManagersOfRegion error: ${error}`)
      return null
    }
  }

  async getAllAdminsOfRegion(country: string) {}

  async findOne(country: string, id: string) {
    try {
      const db = await getFirestoreAdmin(country).firestore()
      const usersRef = await db.collection(USERS_DB_COLLECTION_NAME)

      const currentUserInDB: IUserOfDB | null = await usersRef.doc(id).get()
        .then((user: TFixMeInTheFuture) => {
          const userDecode = {...user.data()}

          return userDecode?.id ? mapUserDataFromApi(userDecode) : null
        })
        .catch((error: TFixMeInTheFuture) => {
          console.error('getUserFromDB error:', error)
          return null
        })

      if (!currentUserInDB) new BadRequestException('users not found, maybe your token isn\'t valid')

      return currentUserInDB
    } catch (error) {
      console.error(`findOne error: ${error}`)
      return null
    }
  }

  async findOneByEmail(country: string, email: string) {}

  async getMe(country: string, token: string): Promise<IUserOfDB | null> {
    try {
      const defaultFbInstance = await getFirestoreAdmin(DEFAULT_REGION)
      const auth = defaultFbInstance.auth()
      if (!auth) throw new InternalServerErrorException('Something wrong with auth')
      const currentFirebaseUser = await getUserByCustomToken(token)
      if (isTokenExpire(currentFirebaseUser)) throw new InternalServerErrorException('Your token expired!')

      const db = await getFirestoreAdmin(country).firestore()
      const usersRef = await db.collection(USERS_DB_COLLECTION_NAME)

      const currentUserInDB: IUserOfDB | null = await usersRef.doc(currentFirebaseUser.uid).get()
        .then((user: TFixMeInTheFuture) => {
          const userDecode = {...user.data()}

          return userDecode?.id ? mapUserDataFromApi(userDecode) : null
        })
        .catch((error: TFixMeInTheFuture) => {
          console.error('getUserFromDB error:', error)
          return null
        })

      if (!currentUserInDB) throw new BadRequestException('users not found, maybe your token isn\'t valid')

      return currentUserInDB
    } catch (error) {
      console.error(`getMe error: ${error}`)
      return null
    }
  }

  /*
  * update yourself or another user
  * country, id, token, updateUserDto
  * */
  async update(
    country: string,
    id: string,
    token: string,
    updateUserDto: UpdateUserDto,
    response: Response
  ) {
    try {
      const defaultFbInstance = await getFirestoreAdmin(DEFAULT_REGION)
      const auth = defaultFbInstance.auth()

      if (!auth) throw new InternalServerErrorException('Something wrong with auth')
      const currentFirebaseUser = await getUserByCustomToken(token)
      if (isTokenExpire(currentFirebaseUser)) throw new InternalServerErrorException('Your token expired!')

      const firebaseInstance = await getFirestoreAdmin(country)
      const db = await firebaseInstance.firestore()
      const usersRef = await db.collection(USERS_DB_COLLECTION_NAME)
      const usersDB: Array<IUserOfDB> = await usersRef
        .where("id", "==", id)
        .get()
        .then((users: TFixMeInTheFuture) => {
          return users.docs.map((user: TFixMeInTheFuture) => {
            const userDecode = {...user.data()}

            return mapUserDataFromApi(userDecode)
          })
        })

      const userDB = usersDB[0]
      if (!userDB.id) new NotFoundException('users not found')

      const updateFireUser: {
        displayName?: string
        email?: string
        phoneNumber?: string
        password?: string
      } = {}
      if (updateUserDto.name) updateFireUser.displayName = updateUserDto.name
      if (updateUserDto.email) updateFireUser.email = updateUserDto.email
      if (updateUserDto.phone) updateFireUser.phoneNumber = updateUserDto.phone
      if (updateUserDto.password) updateFireUser.password = updateUserDto.password

      const userRecord = await auth
        .updateUser(userDB.id, updateFireUser)
        .then((userRecord) => {
          console.log('Successfully updated users', userRecord.toJSON())

          return userRecord
        }).catch((error) => {
          console.log('Error updating users:', error)

          return { error: error.errorInfo.code }
        })

      // @ts-ignore
      if (userRecord?.error)
        throw new BadRequestException(
          'firebase user wasn\'t updated',
          [
            // @ts-ignore
            userRecord.error
          ]
        )

      const { password, ...rest } = updateUserDto
      const newUserData = {
        ...userDB,
        ...rest,
      }
      await usersRef.doc(userDB.id).set(newUserData)

      return newUserData
    } catch (error) {
      console.log({'update error': error})
      // @ts-ignore
      endpointCatchHandler(error, response)
    }
  }

  async remove(country: string, id: string) {}

  async changeUserRegion(...args: any[]) {}
}

export default createHandler(UserController)
