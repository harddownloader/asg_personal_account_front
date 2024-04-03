
/* notify employees of a new user */
// shared
import { fetchRequest } from "@/shared/api/fetchRequest"
import { API_URI } from "@/shared/const"

// entities
import {
  TAccessToken,
  TUserCountry,
  TUserEmail,
  TUserName,
  TUserPassword,
  TUserPhone
} from "@/entities/User"

export type TNotifyEmployeesBody = {
  userName: TUserName
  userEmail: TUserEmail
  userPhone: TUserPhone
  userPassword: TUserPassword
}

export type TNotifyEmployeesArgs = {
  country: TUserCountry
  token: TAccessToken
  body: TNotifyEmployeesBody
}

export const notifyEmployees = async ({
                                        country,
                                        token,
                                        body,
                                      }: TNotifyEmployeesArgs) => {
  try {
    const fetchOptions = {
      method: 'POST',
      credentials: "same-origin",
      body
    }
    return await fetchRequest(
      `${API_URI}notifications/notify-employees-of-a-new-user/${country}`,
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
