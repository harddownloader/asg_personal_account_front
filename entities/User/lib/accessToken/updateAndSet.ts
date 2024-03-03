import nookies from "nookies"
import { refreshAccessToken } from "@/entities/User"
import { cookiesOptions } from "@/shared/lib/cookies"
import { ACCESS_TOKEN_KEY } from "@/shared/lib/providers/auth"
import type { TAccessToken, TUserCountry } from "@/entities/User"

export type TUpdateAndSetArgs = {
  country: TUserCountry
  token: TAccessToken
}

export const updateAndSet = async ({ country, token }: TUpdateAndSetArgs) => {
  const req = await refreshAccessToken({ country, token })
  if (!req) {
    console.trace('updateAndSet: refreshAccessToken wasnt return token')
    return
  }
  const { accessToken } = req
  await console.log({ 'updateAndSet: auth newToken': accessToken })
  await nookies.destroy(null, ACCESS_TOKEN_KEY)
  await nookies.set(null, ACCESS_TOKEN_KEY, accessToken, cookiesOptions.accessToken)
}
