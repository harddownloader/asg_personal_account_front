import { fetchRequest } from "@/shared/api/fetchRequest"
import { API_URI } from "@/shared/const"
import {
  TAccessToken,
  TUserCountry,
  TUserId
} from "@/entities/User"

export type TGetAllByUserIdArgs = {
  userId: TUserId
  country: TUserCountry
  token: TAccessToken
}

export const getAllByUserId = async ({
                                       userId,
                                       country,
                                       token,
                               }: TGetAllByUserIdArgs) => {
  try {
    const fetchOptions = {
      method: 'GET',
      credentials: "same-origin",
    }
    return await fetchRequest(
      `${API_URI}notifications/by-users-id/${country}/${userId}`,
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
