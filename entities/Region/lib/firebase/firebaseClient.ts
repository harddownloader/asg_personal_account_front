import {
  FirebaseOptions,
  getApp,
  initializeApp
} from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "@firebase/firestore"
import { getAnalytics, isSupported } from "firebase/analytics"
import { getStorage } from "firebase/storage"

// entities
import { getRegionClientConfig } from "@/entities/Region/const/regions"

function createFirebaseApp(config: FirebaseOptions) {
  try {
    return getApp()
  } catch {
    return initializeApp(config)
  }
}

function getDefaultRegionConfig() {
  const config = getRegionClientConfig()

  const regionIndex = config.namesList.findIndex((regionName) => regionName === config.default)
  if (regionIndex != -1) return config.list[regionIndex].config

  console.error('firebase client getDefaultRegionConfig error: Region not found!!! Its return first of all.')
  return null // config.list[config.default].config // firstFirebaseClientConfig
}

const firebaseClientConfig = getDefaultRegionConfig()

export const firebaseClient = createFirebaseApp(firebaseClientConfig as FirebaseOptions)

export const firebaseAuth = getAuth(firebaseClient)
export const firebaseFirestore = getFirestore(firebaseClient)
export const firebaseStorage = getStorage(firebaseClient)
export const firebaseAnalytics = isSupported().then(yes => yes ? getAnalytics(firebaseClient) : null)

