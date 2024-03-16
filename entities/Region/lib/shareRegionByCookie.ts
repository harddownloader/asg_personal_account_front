import { parseCookies, destroyCookie, setCookie } from "nookies"
import { REGION_KEY } from "@/entities/Region"


export const setRegionCookie = (regionName: string) => {
  destroyCookie(null, REGION_KEY)
  setCookie(null, REGION_KEY, regionName, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/'
  })
}

export const getRegionCookie = () => {
  const cookies = parseCookies()
  return cookies[REGION_KEY]
}

export const clearRegionCookie = () => {
  destroyCookie(null, REGION_KEY)
}
