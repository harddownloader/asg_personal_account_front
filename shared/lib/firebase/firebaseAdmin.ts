// @ts-nocheck
import * as firebaseAdmin from "firebase-admin"
import { app } from "firebase-admin/lib/firebase-namespace-api"
import {
  // first project (region)
  FIRST_FIREBASE_ADMIN_TYPE,
  FIRST_FIREBASE_ADMIN_PROJECT_ID,
  FIRST_FIREBASE_ADMIN_PRIVATE_KEY_ID,
  FIRST_FIREBASE_ADMIN_PRIVATE_KEY,
  FIRST_FIREBASE_ADMIN_CLIENT_EMAIL,
  FIRST_FIREBASE_ADMIN_CLIENT_ID,
  FIRST_FIREBASE_ADMIN_AUTH_URI,
  FIRST_FIREBASE_ADMIN_TOKEN_URI,
  FIRST_FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  FIRST_FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
  FIRST_FIREBASE_ADMIN_DOMAIN_URL,

  // second project (region)
  SECOND_FIREBASE_ADMIN_TYPE,
  SECOND_FIREBASE_ADMIN_PROJECT_ID,
  SECOND_FIREBASE_ADMIN_PRIVATE_KEY_ID,
  SECOND_FIREBASE_ADMIN_PRIVATE_KEY,
  SECOND_FIREBASE_ADMIN_CLIENT_EMAIL,
  SECOND_FIREBASE_ADMIN_CLIENT_ID,
  SECOND_FIREBASE_ADMIN_AUTH_URI,
  SECOND_FIREBASE_ADMIN_TOKEN_URI,
  SECOND_FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  SECOND_FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
  SECOND_FIREBASE_ADMIN_DOMAIN_URL,

  // third project (region)
  THIRD_FIREBASE_ADMIN_TYPE,
  THIRD_FIREBASE_ADMIN_PROJECT_ID,
  THIRD_FIREBASE_ADMIN_PRIVATE_KEY_ID,
  THIRD_FIREBASE_ADMIN_PRIVATE_KEY,
  THIRD_FIREBASE_ADMIN_CLIENT_EMAIL,
  THIRD_FIREBASE_ADMIN_CLIENT_ID,
  THIRD_FIREBASE_ADMIN_AUTH_URI,
  THIRD_FIREBASE_ADMIN_TOKEN_URI,
  THIRD_FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  THIRD_FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
  THIRD_FIREBASE_ADMIN_DOMAIN_URL,
} from './const'
import {App} from "firebase-admin/lib/app";
import {FIRST_REGION_SHORTNAME, SECOND_REGION_SHORTNAME, THIRD_REGION_SHORTNAME} from "@/entities/Region";

// configs
const firstAppConfig = {
  credential: firebaseAdmin.credential.cert({
    "type": FIRST_FIREBASE_ADMIN_TYPE,
    "project_id": FIRST_FIREBASE_ADMIN_PROJECT_ID,
    "private_key_id": FIRST_FIREBASE_ADMIN_PRIVATE_KEY_ID,
    "private_key": FIRST_FIREBASE_ADMIN_PRIVATE_KEY,
    "client_email": FIRST_FIREBASE_ADMIN_CLIENT_EMAIL,
    "client_id": FIRST_FIREBASE_ADMIN_CLIENT_ID,
    "auth_uri": FIRST_FIREBASE_ADMIN_AUTH_URI,
    "token_uri": FIRST_FIREBASE_ADMIN_TOKEN_URI,
    "auth_provider_x509_cert_url": FIRST_FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": FIRST_FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
  }),
  databaseURL: FIRST_FIREBASE_ADMIN_DOMAIN_URL
}

const secondAppConfig = {
  credential: firebaseAdmin.credential.cert({
    "type": SECOND_FIREBASE_ADMIN_TYPE,
    "project_id": SECOND_FIREBASE_ADMIN_PROJECT_ID,
    "private_key_id": SECOND_FIREBASE_ADMIN_PRIVATE_KEY_ID,
    "private_key": SECOND_FIREBASE_ADMIN_PRIVATE_KEY,
    "client_email": SECOND_FIREBASE_ADMIN_CLIENT_EMAIL,
    "client_id": SECOND_FIREBASE_ADMIN_CLIENT_ID,
    "auth_uri": SECOND_FIREBASE_ADMIN_AUTH_URI,
    "token_uri": SECOND_FIREBASE_ADMIN_TOKEN_URI,
    "auth_provider_x509_cert_url": SECOND_FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": SECOND_FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
  }),
  databaseURL: SECOND_FIREBASE_ADMIN_DOMAIN_URL
}

const thirdAppConfig = {
  credential: firebaseAdmin.credential.cert({
    "type": THIRD_FIREBASE_ADMIN_TYPE,
    "project_id": THIRD_FIREBASE_ADMIN_PROJECT_ID,
    "private_key_id": THIRD_FIREBASE_ADMIN_PRIVATE_KEY_ID,
    "private_key": THIRD_FIREBASE_ADMIN_PRIVATE_KEY,
    "client_email": THIRD_FIREBASE_ADMIN_CLIENT_EMAIL,
    "client_id": THIRD_FIREBASE_ADMIN_CLIENT_ID,
    "auth_uri": THIRD_FIREBASE_ADMIN_AUTH_URI,
    "token_uri": THIRD_FIREBASE_ADMIN_TOKEN_URI,
    "auth_provider_x509_cert_url": THIRD_FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": THIRD_FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
  }),
  databaseURL: THIRD_FIREBASE_ADMIN_DOMAIN_URL
}

let firstApp: app.App | null = null;
let secondApp: app.App | null = null;
let thirdApp: app.App | null = null;
if (!firebaseAdmin.apps.length) {
  firstApp = firebaseAdmin.initializeApp(
    firstAppConfig,
    FIRST_REGION_SHORTNAME
  )

  secondApp = firebaseAdmin.initializeApp(
    secondAppConfig,
    SECOND_REGION_SHORTNAME
  )

  thirdApp = firebaseAdmin.initializeApp(
    thirdAppConfig,
    THIRD_REGION_SHORTNAME
  )
}

const firstRegionApp = firebaseAdmin.apps.find((app) => app.name === FIRST_REGION_SHORTNAME)
const secondRegionApp = firebaseAdmin.apps.find((app) => app.name === SECOND_REGION_SHORTNAME)
const thirdRegionApp = firebaseAdmin.apps.find((app) => app.name === THIRD_REGION_SHORTNAME)

export const fApp = firstRegionApp ? firstRegionApp : firebaseAdmin
export const sApp = secondRegionApp ? secondRegionApp : firebaseAdmin
export const tApp = thirdRegionApp ? thirdRegionApp : firebaseAdmin

export { firebaseAdmin }

export const getFirestoreAdmin = (country: string): app.App => {
  switch (country) {
    case FIRST_REGION_SHORTNAME:
     return fApp
     break
    case SECOND_REGION_SHORTNAME:
      return sApp
      break
    case THIRD_REGION_SHORTNAME:
      return tApp
      break

    default:
      console.error('country not found')
      return fApp
  }
}


