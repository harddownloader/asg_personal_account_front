import { TDecodedAccessToken } from "@/entities/User"

export const isTokenExpire = (decodeToken: TDecodedAccessToken): boolean => {
  return decodeToken.exp < Date.now() / 1000
}
