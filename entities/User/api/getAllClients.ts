import { fetchRequest } from "@/shared/api/fetchRequest"
import { API_URI } from "@/shared/const"
import { TAccessToken, TUserCountry } from "@/entities/User"

export type TGetAllClientsArgs = {
  country: TUserCountry
  token: TAccessToken
}

export const getAllClients = async ({
                                country,
                                token,
                              }: TGetAllClientsArgs) => {
  try {
    const fetchOptions = {
      method: 'GET',
      credentials: "same-origin",
    }
    return await fetchRequest(
      `${API_URI}users/clients/all/${country}`,
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
