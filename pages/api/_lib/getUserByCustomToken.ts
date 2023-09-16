import { Auth, User } from "@firebase/auth"
import { signInWithCustomToken } from "firebase/auth"
import { UnauthorizedException } from "next-api-decorators"
import { USERS_DB_COLLECTION_NAME } from "@/entities/User"

export const getUserByCustomToken = async (auth: Auth, customToken: string) => {
  const currentFirebaseUser: User | null = await signInWithCustomToken(auth, customToken)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user
      console.log('getUserByCustomToken', userCredential.user.uid)
      // await db.collection(USERS_DB_COLLECTION_NAME)

      return user
    })
    .catch((error) => {
      console.log({'getUserByCustomToken': error})

      return null
    })

  if (!currentFirebaseUser) throw new UnauthorizedException('Something wrong with getting userCredential')

  return currentFirebaseUser
}
