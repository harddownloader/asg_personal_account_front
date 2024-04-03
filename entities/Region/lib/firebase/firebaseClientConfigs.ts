/*
* ================== WARNING ==================
* We have to differentiate between client and admin configs.
* Because otherwise we will get errors on the client side,
* that we are connecting code that should be executed only on the server.
* */
import { FirebaseOptions } from "firebase/app"


export const firstFirebaseClientConfig: FirebaseOptions = JSON.parse(
  process.env.NEXT_PUBLIC_FIRST_FIREBASE_CLIENT as string
)

export const secondFirebaseClientConfig: FirebaseOptions = JSON.parse(
  process.env.NEXT_PUBLIC_SECOND_FIREBASE_CLIENT as string
)

export const thirdFirebaseClientConfig: FirebaseOptions = JSON.parse(
  process.env.NEXT_PUBLIC_THIRD_FIREBASE_CLIENT as string
)

export const fourthFirebaseClientConfig: FirebaseOptions = JSON.parse(
  process.env.NEXT_PUBLIC_FOURTH_FIREBASE_CLIENT as string
)

export const fifthFirebaseClientConfig: FirebaseOptions = JSON.parse(
  process.env.NEXT_PUBLIC_FIFTH_FIREBASE_CLIENT as string
)
