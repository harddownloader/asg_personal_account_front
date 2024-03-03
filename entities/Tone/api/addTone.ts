import { fetchRequest } from "@/shared/api/fetchRequest"
import { API_URI } from "@/shared/const"
import type {
  TAccessToken,
  TUserCountry,
  TUserId
} from "@/entities/User"
import type {
  TToneLabel,
  TToneCreatedAt,
  TToneUpdatedAt,
} from "@/entities/Tone"
import {
  TONE_BACKEND_ENDPOINTS_PATH_SECTION,
} from '@/entities/Tone'

export type TAddToneCargoArgs = {
  country: TUserCountry
  token: TAccessToken
  body: {
    label: TToneLabel
    createdAt: TToneCreatedAt
    updatedAt: TToneUpdatedAt
  }
}

export const addTone = async ({
                                country,
                                token,
                                body,
                              }: TAddToneCargoArgs) => {
  try {
    const fetchOptions = {
      method: 'POST',
      credentials: "same-origin",
      body,
    }

    return await fetchRequest(
      `${API_URI}${TONE_BACKEND_ENDPOINTS_PATH_SECTION}/${country}`,
      fetchOptions,
      token
    )
  } catch (error) {
    console.log('addTone request catch error', error)
    return Promise.reject(
      new Error(
        // @ts-ignore
        error?.message
      )
    )
  }
}
