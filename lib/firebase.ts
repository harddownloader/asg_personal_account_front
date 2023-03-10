import {
  FirebaseOptions,
  getApp,
  initializeApp
} from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "@firebase/firestore"
import { getAnalytics, isSupported } from "firebase/analytics"
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from "@/lib/const"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
}

function createFirebaseApp(config: FirebaseOptions) {
  try {
    return getApp()
  } catch {
    return initializeApp(config)
  }
}

export const firebaseApp = createFirebaseApp(firebaseConfig)
export const firebaseAuth = getAuth(firebaseApp)
export const firebaseFirestore = getFirestore(firebaseApp)
export const firebaseAnalytics = isSupported().then(yes => yes ? getAnalytics(firebaseApp) : null)

