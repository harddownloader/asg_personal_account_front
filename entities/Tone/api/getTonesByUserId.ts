import { fetchRequest } from "@/shared/api/fetchRequest"
import { API_URI } from "@/shared/const"
import {
  TAccessToken,
  TUserCountry, TUserId,
} from "@/entities/User"
import { TONE_BACKEND_ENDPOINTS_PATH_SECTION } from '@/entities/Tone'

export type TGetTonesByUserArgs = {
  country: TUserCountry
  token: TAccessToken
  userId: TUserId
}

export const getTonesByUserId = async ({
                                 country,
                                 token,
                                 userId
                               }: TGetTonesByUserArgs) => {
  try {
    const fetchOptions = {
      method: 'GET',
      credentials: "same-origin",
    }

    return await fetchRequest(
      `${API_URI}${TONE_BACKEND_ENDPOINTS_PATH_SECTION}/${country}/byUserId/${userId}`,
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
