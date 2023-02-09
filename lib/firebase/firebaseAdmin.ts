import * as firebaseAdmin from "firebase-admin"
import serviceAccountKey from '@/serviceAccountKey.json'


if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    // @ts-ignore
    credential: firebaseAdmin.credential.cert(serviceAccountKey),
    databaseURL: 'https://asg-personal-account.firebaseapp.com'
  })
}

export { firebaseAdmin }
