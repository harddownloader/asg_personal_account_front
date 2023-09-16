import { fetchRequest } from "@/shared/api/fetchRequest"
import { API_URI } from "@/shared/const"
import { IUpdateCargoReqBody } from "@/entities/Cargo"
import type {
  TAccessToken,
  TUserCountry,
  TUserId
} from "@/entities/User"

export type TUpdateCargoArgs = {
  userId: TUserId
  country: TUserCountry
  token: TAccessToken
  body: IUpdateCargoReqBody
}

export const updateCargo = async ({
                                    userId,
                                    country,
                                    token,
                                    body
                            }: TUpdateCargoArgs) => {
  try {
    const fetchOptions = {
      method: 'PATCH',
      credentials: "same-origin",
      body,
    }

    return await fetchRequest(
      `${API_URI}cargos/${country}/${userId}`,
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
