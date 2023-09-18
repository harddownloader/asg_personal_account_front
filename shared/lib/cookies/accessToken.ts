import nookies from "nookies"
import { cookiesOptions } from "./cookiesOptions"
import { ACCESS_TOKEN_KEY } from "@/shared/lib/providers/auth"

export const ACCESS_TOKEN_DEFAULT_VALUE: string = "" as const

export const destroyAccessToken = () => {
  nookies.destroy(null, ACCESS_TOKEN_KEY)
  nookies.set(null, ACCESS_TOKEN_KEY, ACCESS_TOKEN_DEFAULT_VALUE, cookiesOptions.accessToken)
}
