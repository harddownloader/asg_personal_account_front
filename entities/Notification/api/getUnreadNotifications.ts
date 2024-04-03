// shared
import  { fetchRequest } from "@/shared/api/fetchRequest"
import { API_URI } from "@/shared/const"

// entities
import { TAccessToken, TUserCountry, TUserId } from "@/entities/User"
import {INotification, TNotificationId} from "@/entities/Notification"

export type TGetUnreadNotificationsArgs = {
  userId: TUserId
  country: TUserCountry
  token: TAccessToken
  lastNotificationId?: TNotificationId | null
}

export const getUnreadNotifications = async ({
                                               userId,
                                               country,
                                               token,
                                               lastNotificationId=null
                                             }: TGetUnreadNotificationsArgs): Promise<INotification[]> => {
  try {
    const fetchOptions = {
      method: 'GET',
      credentials: "same-origin",
    }
    return await fetchRequest(
      `${API_URI}notifications/all-unread-notifications/${country}/${userId}/${lastNotificationId}`,
      fetchOptions,
      token
    )
  } catch (error) {
    return Promise.reject(
      new Error(
        // @ts-ignore
        error?.message
      )
    )
  }
}
