import { fetchRequest } from "@/shared/api/fetchRequest"
import { API_URI } from "@/shared/const"
import {
  TAccessToken,
  TUserCountry, TUserId,
} from "@/entities/User"

export type TGetCargosByUserIdArgs = {
  userId: TUserId
  country: TUserCountry
  token: TAccessToken
}

export const getCargosByUserId = async ({
                                          userId,
                                          country,
                                          token,
                                        }: TGetCargosByUserIdArgs) => {
  try {
    const fetchOptions = {
      method: 'GET',
      credentials: "same-origin",
    }

    return await fetchRequest(
      `${API_URI}cargos/byUserId/${country}/${userId}`,
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
