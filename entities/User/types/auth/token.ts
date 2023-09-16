import { IUserOfDB } from "@/entities/User"

export type TAccessToken = string

export type TDecodedAccessToken = {
  aud: string
  iat: number
  exp: number
  iss: string
  sub: string
  uid: string
  claims: IUserOfDB
}
