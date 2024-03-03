import { fetchRequest } from "@/shared/api/fetchRequest"
import { API_URI } from "@/shared/const"
import type {
  TAccessToken,
  TUserCountry,
} from "@/entities/User"
import { TONE_BACKEND_ENDPOINTS_PATH_SECTION } from '@/entities/Tone'

export type TGetTonesCargoArgs = {
  country: TUserCountry
  token: TAccessToken
}

export const getTones = async ({
                                 country,
                                 token,
                               }: TGetTonesCargoArgs) => {
  try {
    const fetchOptions = {
      method: 'GET',
      credentials: "same-origin",
    }

    return await fetchRequest(
      `${API_URI}${TONE_BACKEND_ENDPOINTS_PATH_SECTION}/${country}`,
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
