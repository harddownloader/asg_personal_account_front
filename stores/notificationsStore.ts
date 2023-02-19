import { makeAutoObservable } from 'mobx'
import { UserIdType } from "@/stores/userStore"

export type contentType = string

export interface Notification {
  userId: UserIdType,
  content: contentType,
  isViewed: boolean
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
}

export default new NotificationsStore()
