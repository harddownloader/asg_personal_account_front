import { TUserId } from "@/entities/User"

export type TContentType = string

export type TNotificationId = string
export type TNotificationStatus = boolean

export interface INotification {
  id: TNotificationId
  userId: TUserId
  content: TContentType
  isViewed: TNotificationStatus
}

export interface INotifications {
  items: Array<INotification>
}
