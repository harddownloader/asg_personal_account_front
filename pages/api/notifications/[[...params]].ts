import {
  Body,
  createHandler,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  ValidationPipe
} from "next-api-decorators"
import { v4 as uuidv4 } from "uuid"

// dto
import { UpdateNotificationDto } from "@/pages/api/notifications/dto/update-notification.dto"
import { CreateNotificationDto } from "@/pages/api/notifications/dto/create-notification.dto"
import { NotifyEmployeesOfANewUserDto } from "@/pages/api/notifications/dto/notify-employees-of-a-new-user.dto"
import { NotifyManagersDto } from "@/pages/api/notifications/dto/notify-managers.dto"
import { NotifyAdminsDto } from "@/pages/api/notifications/dto/notify-admins.dto"

// services
import { UserService } from "@/pages/api/users/[[...params]]"

// lib
import { getUserByCustomToken } from "@/pages/api/_lib/getUserByCustomToken"

// entities
import {
  // const
  NOTIFICATION_DB_COLLECTION_NAME,

  // types
  INotification,
  TNotificationId,
} from '@/entities/Notification'
import {
  // const
  DEFAULT_REGION,
} from "@/entities/Region"
import { getFirestoreAdmin } from '@/entities/Region/lib/firebase/firebaseAdmin'
import { IUserOfDB } from "@/entities/User"

// shared
import { TFixMeInTheFuture } from "@/shared/types/types"
import { isTokenExpire } from "@/shared/lib/token"

export class NotificationsRepository {

}

export class NotificationsService {
  async create(
    country: string,
    dto: CreateNotificationDto
  ): Promise<INotification | null> {
    try {
      const db = await getFirestoreAdmin(country).firestore()
      const notificationsRef = await db.collection(NOTIFICATION_DB_COLLECTION_NAME)
      const notificationID: TNotificationId = uuidv4()
      const newNotification: INotification = {
        id: notificationID,
        userId: dto.userId,
        title: dto.title,
        content: dto.content,
        isViewed: false,
      }

      return await notificationsRef
        .doc(notificationID)
        .set(newNotification)
        .then(() => {

          return newNotification
        })
        .catch((e) => {
          console.warn('createNotification error', {e})
          return null
        })
    } catch (error) {
      console.error(`create error: ${error}`)
      return null
    }
  }

  async findAll(country: string) {}

  async findByUserId(
    country: string,
    userId: string,
  ) {
    try {
      const db = await getFirestoreAdmin(country).firestore()
      const notificationsRef = await db.collection(NOTIFICATION_DB_COLLECTION_NAME)

      const notifications: INotification[] = await notificationsRef
        .where("userId", "==", userId)
        .get()
        .then((notifications: TFixMeInTheFuture) => {
          return notifications.docs.map((notification: TFixMeInTheFuture) => {
            const notificationDecode = {...notification.data()}

            return {
              id: notification.id,
              userId: notificationDecode.userId,
              title: notificationDecode.title,
              content: notificationDecode.content,
              isViewed: notificationDecode.isViewed,
            }
          })
        })

      return notifications;
    } catch (error) {
      console.error(`findByUserId error: ${error}`)
      return null
    }
  }

  /* new endpoint */
  async findByCurrentUserToken(country: string, token: string) {
    try {
      const defaultFbInstance = await getFirestoreAdmin(DEFAULT_REGION)
      const auth = defaultFbInstance.auth()
      if (!auth) throw new InternalServerErrorException('Something wrong with auth')
      const currentFirebaseUser = await getUserByCustomToken(token)
      if (isTokenExpire(currentFirebaseUser)) throw new InternalServerErrorException('Your token expired!')

      const db = await getFirestoreAdmin(country).firestore()
      const notificationsRef = await db.collection(NOTIFICATION_DB_COLLECTION_NAME)

      const notifications: INotification[] = await notificationsRef
        .where("userId", "==", currentFirebaseUser.uid)
        .get()
        .then((notifications: TFixMeInTheFuture) => {
          return notifications.docs.map((notification: TFixMeInTheFuture) => {
            const notificationDecode = {...notification.data()}

            return {
              id: notification.id,
              userId: notificationDecode.userId,
              title: notificationDecode.title,
              content: notificationDecode.content,
              isViewed: notificationDecode.isViewed,
            }
          })
        })

      return notifications;
    } catch (error) {
      console.error(`findByCurrentUserToken error: ${error}`)
      return null
    }
  }

  async findOne(country: string, id: string) {}

  public async update(
    country: string,
    id: string,
    dto: UpdateNotificationDto
  ) {
    try {
      const db = await getFirestoreAdmin(country).firestore()
      const notificationsRef = await db.collection(NOTIFICATION_DB_COLLECTION_NAME)
      const notification = await notificationsRef
        .doc(id)
        .get()
        .then((res) => {
          return {...res.data()}
        })

      const updatedNotification = {
        ...notification,
        ...dto
      }
      return await notificationsRef
        .doc(id)
        .set({...updatedNotification})
        .then(() => updatedNotification)
    } catch (error) {
      console.error(`update error: ${error}`)
      return null
    }
  }

  async remove(country: string, id: string) {
    try {

    } catch (error) {
      console.error(`remove error: ${error}`)
      return null
    }
  }

  async getUnreadNotifications(country: string, userId: string, lastNotificationId: string | null) {
    try {
      const db = await getFirestoreAdmin(country).firestore()
      const notificationsRef = await db.collection(NOTIFICATION_DB_COLLECTION_NAME)

      const query = notificationsRef
        .where("userId", "==", userId)
        .limit(5)

      const notifications: INotification[] = await query
        .get()
        .then((notifications: TFixMeInTheFuture) => {
          return notifications.docs.map((notification: TFixMeInTheFuture) => {
            const notificationDecode = {...notification.data()}

            return {
              id: notification.id,
              userId: notificationDecode.userId,
              title: notificationDecode.title,
              content: notificationDecode.content,
              isViewed: notificationDecode.isViewed,
            }
          })
        })

      if (lastNotificationId) {
        const lastNotificationIndex = notifications.findIndex((notification) => notification.id === lastNotificationId)
        console.log('lastNotificationIndex', lastNotificationIndex)
        return notifications.filter((notification, index) => index > lastNotificationIndex)
      }

      return notifications;
    } catch (error) {
      console.error(`findByUserId error: ${error}`)
      return null
    }
  }

  /* notify employees of a new user */
  async notifyManagers(userCountry: string, dto: NotifyManagersDto) {
    try {
      const allManagers: Array<IUserOfDB> = await new UserService().getAllManagersOfRegion(userCountry)
      const allManagesIds: Array<string> = await allManagers.map((manager: IUserOfDB) => manager.id)

      const promisesManagers = await allManagesIds.map((managerId) => {
        return new Promise(async (resolve, reject) => {
          await this.create(userCountry, {
            userId: managerId,
            title: dto.title,
            content: dto.content,
            isViewed: false
          })
        })
      })

      const createdNotificationsRes = await Promise.allSettled(promisesManagers)
      const notifications: Array<INotification> = await createdNotificationsRes.filter((notificationPromiseRes) => {
        return notificationPromiseRes.status !== "rejected"
        // @ts-ignore
      }).map(notificationPromiseRes => notificationPromiseRes?.value)

      console.log('all notifications have been sent')

      return allManagesIds
    } catch (error) {
      console.error(`notifyPersonal error: ${error}`)
      return null
    }
  }

  async notifyAdmins(userCountry: string, dto: NotifyAdminsDto) {
    try {
      const allAdmins: Array<IUserOfDB> = await new UserService().getAllAdminsOfRegion(DEFAULT_REGION)
      const allAdminsIds: Array<string> = await allAdmins.map((manager: IUserOfDB) => manager.id)

      const promisesAdmins = await allAdminsIds.map((adminId) => {
        return new Promise(async (resolve, reject) => {
          await this.create(userCountry, {
            userId: adminId,
            title: dto.title,
            content: dto.content,
            isViewed: false
          })
        })
      })

      const createdNotificationsRes = await Promise.allSettled(promisesAdmins)
      const notifications: Array<INotification> = await createdNotificationsRes.filter((notificationPromiseRes) => {
        return notificationPromiseRes.status !== "rejected"
        // @ts-ignore
      }).map(notificationPromiseRes => notificationPromiseRes?.value)

      console.log('notifyAdmins: all notifications for admins have been sent')

      return [...allAdminsIds]
    } catch (error) {
      console.error(`notifyPersonal error: ${error}`)
      return null
    }
  }

  async notifyEmployees(userCountry: string, dto: NotifyEmployeesOfANewUserDto) {
    try {
      const title = 'Новый пользователь'
      const allManagesIds: Array<string> = await this.notifyManagers(userCountry, {
        title: title,
        content: `${dto.userName} ${dto.userEmail}, ${dto.userPhone}`
      }) || []
      const allAdminsIds: Array<string> = await this.notifyAdmins(userCountry, {
        title: title,
        content: `${dto.userName} ${dto.userEmail}:${dto.userPassword}, ${dto.userPhone} ${userCountry}`
      }) || []

      const response = [
        ...allManagesIds,
        ...allAdminsIds
      ]
      console.log('notifyEmployees: all notifications have been sent', response)

      return response
    } catch (error) {
      console.error(`notifyEmployees error: ${error}`)
      return null
    }
  }
}

class NotificationsController {
  private readonly notificationsService: NotificationsService
  constructor() {
    this.notificationsService = new NotificationsService()
  }

  @Post('/:country')
  create(
    @Param('country') country: string,
    @Body() createNotificationDto: CreateNotificationDto
  ) {
    return this.notificationsService.create(country, createNotificationDto);
  }

  @Get('/:country')
  findAll(@Param('country') country: string) {
    return this.notificationsService.findAll(country);
  }

  @Get('/by-users-id/:country/:userId')
  findByUserId(
    @Param('country') country: string,
    @Param('userId') userId: string
  ) {
    return this.notificationsService.findByUserId(country, userId);
  }

  @Get('/:country/:id')
  findOne(
    @Param('country') country: string,
    @Param('id') id: string
  ) {
    return this.notificationsService.findOne(country, id);
  }

  @Patch('/:country/:id')
  update(
    @Param('country') country: string,
    @Param('id') id: string,
    @Body(ValidationPipe) updateNotificationDto: UpdateNotificationDto
  ) {
    return this.notificationsService.update(country, id, updateNotificationDto);
  }

  @Delete('/:country/:id')
  remove(
    @Param('country') country: string,
    @Param('id') id: string
  ) {
    return this.notificationsService.remove(country, id);
  }

  @Get('/all-unread-notifications/:country/:id/:lastNotificationId')
  getUnreadNotifications(
    @Param('country') country: string,
    @Param('id') id: string,
    @Param('lastNotificationId') lastNotificationId: string | null
  ) {
    return this.notificationsService.getUnreadNotifications(country, id, lastNotificationId)
  }

  /* notify employees of a new user */
  @Post('/notify-employees-of-a-new-user/:country')
  notifyPersonal(
    @Param('country') country: string,
    @Body() notifyEmployeesOfANewUserDto: NotifyEmployeesOfANewUserDto
  ) {
    return this.notificationsService.notifyEmployees(country, notifyEmployeesOfANewUserDto)
  }
}

export default createHandler(NotificationsController)
