import * as firebaseAdmin from "firebase-admin"
import { app } from "firebase-admin/lib/firebase-namespace-api"
import { getRegionServerConfig } from "@/entities/Region/const/regions/configServer"

const config = getRegionServerConfig()

if (!firebaseAdmin.apps.length) {
  config && config.list.forEach((region) => {
    firebaseAdmin.initializeApp(
      region.config,
      region.name
    )
  })
}

export { firebaseAdmin }

export const getFirestoreAdmin = (country: string): app.App => {
  try {
    const config = getRegionServerConfig()

    const regionIndex = config && config.namesList.findIndex((regionName) => regionName === config.default)
    // @ts-ignore
    if (regionIndex != -1) return firebaseAdmin.apps.find((app) => app.name === country)

    console.error('getFirestoreAdmin error: Country not found!!! Its return first of all.')
    // @ts-ignore
    return null // config.list[config.default].config // fApp
  } catch (error) {
    console.warn('getFirestoreAdmin catch error: Something went wrong with getting firebaseAdmin app', error)
    // @ts-ignore
    return null
  }
}


