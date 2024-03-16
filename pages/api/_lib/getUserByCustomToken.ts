import { Auth, User } from "@firebase/auth"
import { signInWithCustomToken } from "firebase/auth"
import { UnauthorizedException } from "next-api-decorators"
import { BaseAuth } from "firebase-admin/lib/auth/base-auth"
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier"
import { parseJwtOnServer } from "@/shared/lib/token"

// export const getUserByCustomToken = async (auth: Auth, customToken: string) => {
//   const currentFirebaseUser: User | null = await signInWithCustomToken(auth, customToken)
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user
//       console.log('getUserByCustomToken', userCredential.user.uid)
//
//       return user
//     })
//     .catch((error) => {
//       console.warn({'error getUserByCustomToken': error})
//
//       return null
//     })
//
//   if (!currentFirebaseUser) throw new UnauthorizedException('Something wrong with getting userCredential')
//
//   return currentFirebaseUser
// }

export const getUserByCustomToken = (customToken: string) => {
  const currentFirebaseUser = parseJwtOnServer(customToken)

  if (!currentFirebaseUser) throw new UnauthorizedException('Something wrong with getting userCredential')

  return currentFirebaseUser
}

// export const getUserByCustomToken = async (auth: BaseAuth, customToken: string): Promise<DecodedIdToken> => {
//   const currentFirebaseUser: DecodedIdToken | null = await signInWithCustomToken(customToken)
//     .then((decodedToken) => {
//       console.log('getUserByCustomToken', decodedToken.uid)
//
//       return decodedToken
//     })
//     .catch((error) => {
//       console.warn({'error getUserByCustomToken': error})
//
//       return null
//     })
//
//   if (!currentFirebaseUser) throw new UnauthorizedException('Something wrong with getting userCredential')
//
//   return currentFirebaseUser
// }
