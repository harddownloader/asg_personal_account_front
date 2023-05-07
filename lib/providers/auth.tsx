import React, { useState, useEffect, useContext, createContext } from "react"
import nookies from "nookies"
import { firebaseAuth } from "@/lib/firebase"
import {
  onIdTokenChanged,
  User as FirebaseUser
} from "firebase/auth"

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
        nookies.destroy(null, "token")
        nookies.set(null, "token", "", {path: '/'})
        return
      }

      console.log(`updating token...`)
      const token = await user.getIdToken()
      setUser(user)
      nookies.destroy(null, "token")
      nookies.set(null, "token", token, {path: '/'})
    })
  }, [])

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      console.log(`refreshing token...`)
      const user = firebaseAuth.currentUser
      if (user) await user.getIdToken(true)
    }, 10 * 60 * 1000)

    return () => clearInterval(handle)
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}