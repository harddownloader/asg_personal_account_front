import { action, makeAutoObservable, makeObservable } from 'mobx'
import * as Sentry from "@sentry/nextjs"

// entities
import {
  TDecodedAccessToken,
  TUserCountry,
  UserStore
} from "@/entities/User"
import {
  // types
  INotifications,
  INotification,
  TNotificationId,
  TNotificationStatus,
  TGetUnreadNotificationsArgs,

  // api
  getUnreadNotifications,

  // store
  NotificationsStore,
} from '@/entities/Notification'
import { RegionsStore } from "@/entities/Region"

// shared
import {
  ACCESS_TOKEN_KEY,
  AUTHORIZATION_HEADER_KEY,
} from "@/shared/lib/providers/auth"
import { getCookies } from "@/shared/lib/cookies"
import { parseJwtOnServer } from "@/shared/lib/token"

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

  poolingNewCargosForUser = async () => {
    const token = await getCookies(ACCESS_TOKEN_KEY)
    if (!token) {
      console.warn(`_NotificationsListPooling poolingNewCargosForUser: token('${token}') not found`)
      return null
    }

    const decodedJwt: TDecodedAccessToken = await parseJwtOnServer(token)
    const countryByToken = decodedJwt.claims.country
    const userIdByToken = decodedJwt.claims.id

    const requestData: TGetUnreadNotificationsArgs = {
      userId: userIdByToken,
      country: countryByToken,
      token,
      lastNotificationId: null
    }

    const notifications = NotificationsStore.notifications.items
    const notificationsIds = notifications.map(notification => notification.id)
    if (notifications.length) {
      const lastNotification = notifications[0]
      requestData.lastNotificationId = lastNotification.id
    }

    const newNotifications = await getUnreadNotifications(requestData)

    if (Array.isArray(newNotifications) && newNotifications.length)
      newNotifications.forEach((notification) => {
        if (!notificationsIds.includes(notification.id)) NotificationsStore.add(notification)
      })

    return newNotifications
  }
}
