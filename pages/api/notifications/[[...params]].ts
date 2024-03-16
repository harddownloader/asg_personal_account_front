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
import { UpdateNotificationDto } from "@/pages/api/notifications/dto/update-notification.dto"
import { CreateNotificationDto } from "@/pages/api/notifications/dto/create-notification.dto"
import { getFirestoreAdmin } from "@/shared/lib/firebase/firebaseAdmin"
import { NOTIFICATION_DB_COLLECTION_NAME } from '@/entities/Notification'
import type { INotification, TNotificationId } from "@/entities/Notification"
import { TFixMeInTheFuture } from "@/shared/types/types"
import { getUserByCustomToken } from "@/pages/api/_lib/getUserByCustomToken"
import { DEFAULT_REGION } from "@/entities/Region"
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
              content: notificationDecode.content,
              isViewed: notificationDecode.isViewed,
            }
          })
        })

      return notifications;
    } catch (error) {
      console.error(`refreshToken error: ${error}`)
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
}

export default createHandler(NotificationsController)
