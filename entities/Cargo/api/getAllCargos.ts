import { fetchRequest } from "@/shared/api/fetchRequest"
import { API_URI } from "@/shared/const"
import {
  TAccessToken,
  TUserCountry,
} from "@/entities/User"

export type TGetAllCargosArgs = {
  country: TUserCountry
  token: TAccessToken
}

export const getAllCargos = async ({
                                     country,
                                     token,
                                   }: TGetAllCargosArgs) => {
  try {
    const fetchOptions = {
      method: 'GET',
      credentials: "same-origin",
    }
    return await fetchRequest(
      `${API_URI}cargos/${country}`,
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
