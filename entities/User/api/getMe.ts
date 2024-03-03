import { fetchRequest } from "@/shared/api/fetchRequest"
import { API_URI } from "@/shared/const"
import {
  TAccessToken,
  TUserCountry,
  TUserId
} from "@/entities/User"

export type TGetMeArgs = {
  userId: TUserId
  country: TUserCountry
  token: TAccessToken
}

export const getMe = async ({
                              userId,
                              country,
                              token,
                            }: TGetMeArgs) => {
  try {
    const fetchOptions = {
      method: 'GET',
      credentials: "same-origin",
    }
    return await fetchRequest(
      `${API_URI}users/me/${country}/${userId}`,
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
