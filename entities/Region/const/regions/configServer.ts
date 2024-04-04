import {
  REGIONS_NAMES,
  DEFAULT_REGION,
  FIRST_REGION_SHORTNAME,
  SECOND_REGION_SHORTNAME,
  THIRD_REGION_SHORTNAME,
  FOURTH_REGION_SHORTNAME,
  FIFTH_REGION_SHORTNAME,
  SIXTH_REGION_SHORTNAME,
} from "./list"
import { REGION_KEY } from "./cookies"
import * as firebaseAdmin from "firebase-admin"

export const getRegionServerConfig = () => {
  try {
    return {
      default: DEFAULT_REGION,
      list: [
        {
          name: FIRST_REGION_SHORTNAME,
          config: {
            credential: firebaseAdmin.credential.cert(
              JSON.parse(
                process.env.NEXT_PUBLIC_FIRST_FIREBASE_ADMIN as string
              )
            ),
            databaseURL: process.env.NEXT_PUBLIC_FIRST_FIREBASE_ADMIN_DOMAIN_URL || ""
          }
        },
        {
          name: SECOND_REGION_SHORTNAME,
          config: {
            credential: firebaseAdmin.credential.cert(
              JSON.parse(
                process.env.NEXT_PUBLIC_SECOND_FIREBASE_ADMIN as string
              )
            ),
            databaseURL: process.env.NEXT_PUBLIC_SECOND_FIREBASE_ADMIN_DOMAIN_URL || ""
          }
        },
        {
          name: THIRD_REGION_SHORTNAME,
          config: {
            credential: firebaseAdmin.credential.cert(
              JSON.parse(
                process.env.NEXT_PUBLIC_THIRD_FIREBASE_ADMIN as string
              )
            ),
            databaseURL: process.env.NEXT_PUBLIC_THIRD_FIREBASE_ADMIN_DOMAIN_URL || ""
          }
        },
        {
          name: FOURTH_REGION_SHORTNAME,
          config: {
            credential: firebaseAdmin.credential.cert(
              JSON.parse(
                process.env.NEXT_PUBLIC_FOURTH_FIREBASE_ADMIN as string
              )
            ),
            databaseURL: process.env.NEXT_PUBLIC_FOURTH_FIREBASE_ADMIN_DOMAIN_URL || ""
          }
        },
        {
          name: FIFTH_REGION_SHORTNAME,
          config: {
            credential: firebaseAdmin.credential.cert(
              JSON.parse(
                process.env.NEXT_PUBLIC_FIFTH_FIREBASE_ADMIN as string
              )
            ),
            databaseURL: process.env.NEXT_PUBLIC_FIFTH_FIREBASE_ADMIN_DOMAIN_URL || ""
          }
        },
        {
          name: SIXTH_REGION_SHORTNAME,
          config: {
            credential: firebaseAdmin.credential.cert(
              JSON.parse(
                process.env.NEXT_PUBLIC_SIXTH_FIREBASE_ADMIN as string
              )
            ),
            databaseURL: process.env.NEXT_PUBLIC_SIXTH_FIREBASE_ADMIN_DOMAIN_URL || ""
          }
        },
      ],
      namesList: REGIONS_NAMES,
      cookiesKeys: {
        current: REGION_KEY
      }
    }
  } catch (error) {
    console.warn('getRegionServerConfig error: Something went wrong with getting config', error)

    return null
  }
}
