// shared
import { fetchRequest } from "@/shared/api/fetchRequest"
import { API_URI } from "@/shared/const"

// entities
import { TAccessToken, TUserCountry, TUserId } from "@/entities/User"
import { TNotificationContent } from "@/entities/Notification"
import {TNotificationTitle} from "@/entities/Notification/types";

export type TCreateNotificationBody = {
  userId: TUserId
  title: TNotificationTitle
  content: TNotificationContent
}

export type TCreateNotificationArgs = {
  country: TUserCountry
  token: TAccessToken
  body: TCreateNotificationBody
}

export const createNotification = async ({
                                           country,
                                           token,
                                           body,
                                   }: TCreateNotificationArgs) => {
  try {
    const fetchOptions = {
      method: 'POST',
      credentials: "same-origin",
      body
    }
    return await fetchRequest(
      `${API_URI}notifications/${country}`,
      fetchOptions,
      token,
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
