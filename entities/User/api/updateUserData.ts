import { fetchRequest } from "@/shared/api/fetchRequest"
import { TAccessToken, ISaveContactUserDataArgs } from "@/entities/User"

export type TUpdateUserArgs = {
  token: TAccessToken
} & ISaveContactUserDataArgs

export async function updateUserData({
                                   country,
                                   id,
                                   token,
                                   name,
                                   phone,
                                   email,
                                   city,
                                   userCodeId,
                                 }: TUpdateUserArgs) {
  try {
    const fetchOptions = {
      method: 'PATCH',
      credentials: "same-origin",
      body: {
        name,
        phone,
        email,
        city,
        userCodeId,
        id
      }
    }
    return await fetchRequest(
      `/api/users/${country}/${id}`,
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
