import {
  FirebaseOptions,
  getApp,
  initializeApp
} from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "@firebase/firestore"
import { getAnalytics, isSupported } from "firebase/analytics"
import { getStorage } from "firebase/storage"
import {
  FIRST_FIREBASE_API_KEY,
  FIRST_FIREBASE_AUTH_DOMAIN,
  FIRST_FIREBASE_PROJECT_ID,
  FIRST_FIREBASE_STORAGE_BUCKET,
  FIRST_FIREBASE_MESSAGING_SENDER_ID,
  FIRST_FIREBASE_APP_ID,
  FIRST_FIREBASE_MEASUREMENT_ID,
} from "@/shared/lib/firebase/const"


const firstFirebaseClientConfig: FirebaseOptions = {
  apiKey: FIRST_FIREBASE_API_KEY,
  authDomain: FIRST_FIREBASE_AUTH_DOMAIN,
  projectId: FIRST_FIREBASE_PROJECT_ID,
  storageBucket: FIRST_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIRST_FIREBASE_MESSAGING_SENDER_ID,
  appId: FIRST_FIREBASE_APP_ID,
  measurementId: FIRST_FIREBASE_MEASUREMENT_ID
}

function createFirebaseApp(config: FirebaseOptions) {
  try {
    return getApp()
  } catch {
    return initializeApp(config)
  }
}

// export const firebaseClient = createFirebaseApp(firebaseConfig)
export const firebaseClient = createFirebaseApp(firstFirebaseClientConfig)

export const firebaseAuth = getAuth(firebaseClient)
export const firebaseFirestore = getFirestore(firebaseClient)
export const firebaseStorage = getStorage(firebaseClient)
export const firebaseAnalytics = isSupported().then(yes => yes ? getAnalytics(firebaseClient) : null)

