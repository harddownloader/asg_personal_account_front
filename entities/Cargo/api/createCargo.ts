import { fetchRequest } from "@/shared/api/fetchRequest"
import { API_URI } from "@/shared/const"
import type {
  TAccessToken,
  TUserCountry,
  TUserId
} from "@/entities/User"
import type { IAddCargo } from "@/entities/Cargo"

export type TCreateCargoArgs = {
  country: TUserCountry
  token: TAccessToken
  body: IAddCargo
}

export const createCargo = async ({
                                    country,
                                    token,
                                    body,
                            }: TCreateCargoArgs) => {
  try {
    const fetchOptions = {
      method: 'POST',
      credentials: "same-origin",
      body,
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
