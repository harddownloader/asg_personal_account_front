import {
  useState,
  useEffect,
  useContext,
  createContext,
} from "react"
import nookies from "nookies"
import {
  onIdTokenChanged,
  User as FirebaseUser
} from "firebase/auth"
import { firebaseAuth } from "@/shared/lib/firebase"
import { API_URI } from "@/shared/const"
import { getCookies, cookiesOptions, destroyAccessToken } from "@/shared/lib/cookies"
import { parseJwtOnBrowser } from "@/shared/lib/token"

import type { TDecodedAccessToken } from "@/entities/User"
import { refreshAccessToken, updateAndSet } from "@/entities/User"

export const ACCESS_TOKEN_KEY: string = "access_token" as const
export const REFRESH_TOKEN_KEY: string = "refresh_token" as const

export const AUTHORIZATION_HEADER_KEY: string = "authorization" as const

const TTL_OF_REFRESHING_IN_MINUTES: number = 10
const TTL_OF_REFRESHING_IN_MS: number = TTL_OF_REFRESHING_IN_MINUTES * 60 * 1000

const AuthContext = createContext<{ user: FirebaseUser | null }>({
  user: null,
})

export type AuthProviderProps = {
  children: any
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).nookies = nookies
    }

    return onIdTokenChanged(firebaseAuth, async (user) => {
      console.log(`token changed!`)
      if (!user) {
        console.log(`no token found...`)
        setUser(null)
        destroyAccessToken()
        return
      }

      console.log(`updating token...`)

      const accessToken = await getCookies(ACCESS_TOKEN_KEY)
      if (accessToken && accessToken !== 'undefined') {
        const decodeJWT: TDecodedAccessToken = await parseJwtOnBrowser(accessToken)
        const { country } = decodeJWT.claims
        console.log({'onIdTokenChanged country': country})
        if (!country) return

        const newToken = await fetch(`${API_URI}auth/refresh/${country}`, {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
            [`${AUTHORIZATION_HEADER_KEY}`]: `Bearer ${accessToken}`
          }),
          credentials: "same-origin",
        })
          .then((res) => res.json())
          .then((res) => res.accessToken)
        setUser(user)
        nookies.destroy(null, ACCESS_TOKEN_KEY)
        nookies.set(null, ACCESS_TOKEN_KEY, accessToken, cookiesOptions.accessToken)
      }
    })
  }, [])

  /* force refresh the token every 10 minutes */
  useEffect(() => {
    const handle = setInterval(async () => {
      console.log(`refreshing token...`)

      const user = firebaseAuth.currentUser
      const token = await getCookies(ACCESS_TOKEN_KEY)
      if (user && token) {
        const decodedJwt = await parseJwtOnBrowser(token)
        const country = decodedJwt?.claims?.country

        if (typeof country === 'string' && country) {
          await updateAndSet({ country, token })
        }
      }

    }, TTL_OF_REFRESHING_IN_MS)

    return () => clearInterval(handle)
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
