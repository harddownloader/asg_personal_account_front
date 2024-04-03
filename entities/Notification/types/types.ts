import { TUserId } from "@/entities/User"

export type TNotificationContent = string
export type TNotificationTitle = string

export type TNotificationId = string
export type TNotificationStatus = boolean

export interface INotification {
  id: TNotificationId
  userId: TUserId
  title: TNotificationTitle
  content: TNotificationContent
  isViewed: TNotificationStatus
}

export interface INotifications {
  items: Array<INotification>
}
