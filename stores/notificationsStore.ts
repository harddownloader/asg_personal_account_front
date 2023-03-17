import { makeAutoObservable } from 'mobx'
import { doc, FieldPath, updateDoc } from "firebase/firestore"
import { firebaseAuth, firebaseFirestore } from "@/lib/firebase"
import { USER_ROLE_CLIENT, UserIdType, UserOfDB } from "@/stores/userStore"

export const NOTIFICATION_DB_COLLECTION_NAME: string = 'notifications'

export type contentType = string

export type notificationId = string
export type notificationStatus = boolean

export interface Notification {
  id: notificationId
  userId: UserIdType
  content: contentType
  isViewed: notificationStatus
}

export interface Notifications {
  items: Array<Notification>
}

class NotificationsStore {
  notifications: Notifications = {
    items: [],
  }

  constructor() {
    makeAutoObservable(this)
  }

  setList = (list: Array<Notification>) => {
    this.notifications.items = [...list]
  }

  add = (notification: Notification) => {
    this.notifications.items = [
      ...this.notifications.items,
      notification
    ]
  }

  editStatus = async (id: notificationId, status: notificationStatus) => {
    // let timeoutId: ReturnType<typeof setTimeout>
    // we can use store for it, some debounceNotificationList
    // let notificationIdsStack: Array<string> = []

    // return ((...args) => {
    //   console.log({args})
    //   clearTimeout(timeoutId)
    //   notificationIdsStack.push(args.id)
    //   timeoutId = setTimeout(() => {
    //     console.log('notificationIdsStack', [...notificationIdsStack])
    //     notificationIdsStack = notificationIdsStack.filter((_notificationId) => _notificationId !== id)
    //   }, 10000)
    // })({id})

    const notificationsTmp = await JSON.parse(JSON.stringify(this.notifications.items))
    // const notificationIdsList = []
    // const updatedNotifications = notificationsTmp
    const newNotificationsList: Array<Notification> = await Promise.all(notificationsTmp.map(async (notification: Notification): Promise<Notification> => {
      if (notification.id === id && notification.isViewed !== status) {
        notification.isViewed = status

        await console.log('editStatus', {
          args: {
            id,
            status,
          },
          notification,
          id_bool: notification.id === id,
          isViewed_bool: notification.isViewed !== status
        })

        const notificationRef = doc(firebaseFirestore, NOTIFICATION_DB_COLLECTION_NAME, notification.id)
        const updateStatusReqBody: {
          isViewed: notificationStatus
        } = {
          isViewed: notification.isViewed
        }
        await updateDoc(
          notificationRef, //@ts-ignore
          updateStatusReqBody,
          { merge: false }
        ).then(() => {}).catch((error) => console.warn('setDoc notification status error:', error))
      }

      return notification
    }))
    await console.log({newNotificationsList})
    this.notifications.items = newNotificationsList
  }
}

export default new NotificationsStore()
