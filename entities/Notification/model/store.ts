import { action, makeAutoObservable, makeObservable } from 'mobx'
import { ACCESS_TOKEN_KEY, AUTHORIZATION_HEADER_KEY } from "@/shared/lib/providers/auth"
import { getCookies } from "@/shared/lib/cookies"
import type { TUserCountry } from "@/entities/User"
import type {
  INotifications,
  INotification,
  TNotificationId,
  TNotificationStatus,
} from '@/entities/Notification'
import * as Sentry from "@sentry/nextjs"

export class _NotificationsStore {
  notifications: INotifications = {
    items: [],
  }

  constructor() {
    makeAutoObservable(this)
  }

  setList = (list: Array<INotification>) => {
    this.notifications.items = [...list]
  }

  clearList = () => {
    this.notifications.items = []
  }

  add = (notification: INotification) => {
    this.notifications.items = [
      ...this.notifications.items,
      notification
    ]
  }

  editStatus = async (id: TNotificationId, country: TUserCountry, status: TNotificationStatus) => {
    const notificationsTmp = await JSON.parse(JSON.stringify(this.notifications.items))
    this.notifications.items = await notificationsTmp.map((notification: INotification) => {
      if (notification.id === id) notification.isViewed = status
      return notification
    })

    const token = await getCookies(ACCESS_TOKEN_KEY)

    await fetch(`/api/notifications/${country}/${id}`, {
      method: 'PATCH',
      headers: new Headers({
        'Content-Type': 'application/json',
        [`${AUTHORIZATION_HEADER_KEY}`]: `Bearer ${token}`
      }),
      credentials: "same-origin",
      body: JSON.stringify({
        isViewed: status
      })
    })
      .then(() => {})
      .catch((error) => {
        console.warn('notificationsStore.editStatus: notification status error:', error)
        Sentry.captureException(error)
        return null
      })
  }

  clearAll = () => {
    this.clearList()
  }
}

export class _NotificationsListPooling {
  constructor(
    private readonly rootStore: _NotificationsStore,
  ) {
    this.rootStore = rootStore

    makeObservable(this, {
      poolingNewCargosForUser: action
    })
  }

  poolingNewCargosForUser = () => {

  }
}
