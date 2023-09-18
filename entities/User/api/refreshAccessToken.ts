import { API_URI } from "@/shared/const"
import type { TAccessToken, TUserCountry } from '@/entities/User'
import { fetchRequest } from "@/shared/api/fetchRequest"

export type TRefreshAccessTokenArgs = {
  country: TUserCountry
  token: TAccessToken
}

export const refreshAccessToken = async ({ country, token }: TRefreshAccessTokenArgs) => {
  try {
    const fetchOptions = {
      method: 'GET',
      credentials: "same-origin",
    }
    return await fetchRequest(
      `${API_URI}auth/refresh/${country}`,
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
