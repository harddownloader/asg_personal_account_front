import { fetchRequest } from "@/shared/api/fetchRequest"
import {
  TUserCountry,
  TUserEmail,
  TUserName,
  TUserOfAnExistingRegion,
  TUserPassword,
  TUserPhone
} from "@/entities/User"

export type TRegisterUser = {
  name: TUserName
  email: TUserEmail
  phone: TUserPhone
  country: TUserOfAnExistingRegion
  password: TUserPassword
}

export const registerUser = async ({
                               name,
                               phone,
                               email,
                               country,
                               password,
                             }: TRegisterUser) => {
  try {
    const fetchOptions = {
      method: 'POST',
      credentials: "same-origin",
      body: {
        name,
        phone,
        email,
        password,
        country,
      }
    }
    return await fetchRequest(
      `/api/auth/register/${country}`,
      fetchOptions,
    )
  } catch (error) {
    console.log('registerUser error', {error})
    return Promise.reject(
      // @ts-ignore
      new Error(error?.message)
    )
  }
}
