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

  SECOND_FIREBASE_API_KEY,
  SECOND_FIREBASE_AUTH_DOMAIN,
  SECOND_FIREBASE_PROJECT_ID,
  SECOND_FIREBASE_STORAGE_BUCKET,
  SECOND_FIREBASE_MESSAGING_SENDER_ID,
  SECOND_FIREBASE_APP_ID,
  SECOND_FIREBASE_MEASUREMENT_ID,

  THIRD_FIREBASE_API_KEY,
  THIRD_FIREBASE_AUTH_DOMAIN,
  THIRD_FIREBASE_PROJECT_ID,
  THIRD_FIREBASE_STORAGE_BUCKET,
  THIRD_FIREBASE_MESSAGING_SENDER_ID,
  THIRD_FIREBASE_APP_ID,
  THIRD_FIREBASE_MEASUREMENT_ID,
} from "@/shared/lib/firebase/const"
import {
  DEFAULT_REGION,
  FIRST_REGION_SHORTNAME,
  SECOND_REGION_SHORTNAME,
  THIRD_REGION_SHORTNAME
} from "@/entities/Region";


const firstFirebaseClientConfig: FirebaseOptions = {
  apiKey: FIRST_FIREBASE_API_KEY,
  authDomain: FIRST_FIREBASE_AUTH_DOMAIN,
  projectId: FIRST_FIREBASE_PROJECT_ID,
  storageBucket: FIRST_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIRST_FIREBASE_MESSAGING_SENDER_ID,
  appId: FIRST_FIREBASE_APP_ID,
  measurementId: FIRST_FIREBASE_MEASUREMENT_ID
}

const secondFirebaseClientConfig: FirebaseOptions = {
  apiKey: SECOND_FIREBASE_API_KEY,
  authDomain: SECOND_FIREBASE_AUTH_DOMAIN,
  projectId: SECOND_FIREBASE_PROJECT_ID,
  storageBucket: SECOND_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: SECOND_FIREBASE_MESSAGING_SENDER_ID,
  appId: SECOND_FIREBASE_APP_ID,
  measurementId: SECOND_FIREBASE_MEASUREMENT_ID
}

const thirdFirebaseClientConfig: FirebaseOptions = {
  apiKey: THIRD_FIREBASE_API_KEY,
  authDomain: THIRD_FIREBASE_AUTH_DOMAIN,
  projectId: THIRD_FIREBASE_PROJECT_ID,
  storageBucket: THIRD_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: THIRD_FIREBASE_MESSAGING_SENDER_ID,
  appId: THIRD_FIREBASE_APP_ID,
  measurementId: THIRD_FIREBASE_MEASUREMENT_ID
}

function createFirebaseApp(config: FirebaseOptions) {
  try {
    return getApp()
  } catch {
    return initializeApp(config)
  }
}

function getDefaultRegionConfig() {
  switch (DEFAULT_REGION) {
    case FIRST_REGION_SHORTNAME:
      return firstFirebaseClientConfig
    case SECOND_REGION_SHORTNAME:
      return secondFirebaseClientConfig
    case THIRD_REGION_SHORTNAME:
      return thirdFirebaseClientConfig

    default:
      console.error('firebase client getDefaultRegionConfig error: Region not found!!! Its return first of all.')
      return firstFirebaseClientConfig
  }
}

const firebaseClientConfig = getDefaultRegionConfig()

// export const firebaseClient = createFirebaseApp(firebaseConfig)
export const firebaseClient = createFirebaseApp(firebaseClientConfig)

export const firebaseAuth = getAuth(firebaseClient)
export const firebaseFirestore = getFirestore(firebaseClient)
export const firebaseStorage = getStorage(firebaseClient)
export const firebaseAnalytics = isSupported().then(yes => yes ? getAnalytics(firebaseClient) : null)

