import type { NextApiRequest, NextApiResponse } from 'next'
import { parseCookies } from "nookies"

// utils
import { firebaseAdmin } from "@/lib/firebase/firebaseAdmin"
import { fixMeInTheFuture } from "@/lib/types"
import { validateEmail } from "@/lib/validation/email"
import { UserOfDB, USERS_DB_COLLECTION_NAME, UserSavingResponse } from "@/stores/userStore"

const UserProfileHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const response: UserSavingResponse = {
      data: {
        accountSaving: {
          errors: []
        }
      }
    }

    const { id, email, name, phone, userCodeId, city } = req.body
    if (!name || name.length < 2) {
      response.data.accountSaving.errors.push({
        field: 'name',
        message: 'Введите имя'
      })
    }
    if (!phone || phone.length < 5) {
      response.data.accountSaving.errors.push({
        field: 'phone',
        message: 'Не валидный телефон'
      })
    }
    if (!email || !validateEmail(email)) {
      response.data.accountSaving.errors.push({
        field: 'email',
        message: 'Не валидный email'
      })
    }

    if (!response.data.accountSaving.errors.length) {
      try {
        // if the user is authenticated
        const cookies = parseCookies({req})
        // console.log(JSON.stringify(cookies, null, 2))
        const currentFirebaseUser = await firebaseAdmin.auth().verifyIdToken(cookies.token)

        const db = firebaseAdmin.firestore()
        const usersRef = await db.collection(USERS_DB_COLLECTION_NAME)
        const usersDB: Array<UserOfDB> = await usersRef
          .where("id", "==", id)
          .get()
          .then((users: fixMeInTheFuture) => {
            return users.docs.map((user: fixMeInTheFuture) => {
              const userDecode = {...user.data()}

              return {
                id: user.id,
                name: userDecode.name,
                email: userDecode.email,
                phone: userDecode.phone,
                city: userDecode.city,
                role: userDecode.role,
                userCodeId: userDecode.userCodeId,
              }
            })
          })

        const userDB = usersDB[0]
        if (!userDB.id) {
          response.data.accountSaving.errors.push({
            field: 'DB',
            message: 'user not found'
          })
          return res.status(404).json({response})
        }

        await firebaseAdmin.auth().updateUser(userDB.id, {
          email,
          displayName: name
        }).then((userRecord) => {
          console.log('Successfully updated user', userRecord.toJSON())

          return userRecord
        }).catch((error) => {
          console.log('Error updating user:', error)
        })

        const newUserData = {
          ...userDB,
          name,
          phone,
          email,
          userCodeId,
          city,
        }
        await usersRef.doc(userDB.id).set(newUserData)

        return res.status(200).json({ ...newUserData })
      } catch (err) {
        // either the `token` cookie didn't exist
        // or token verification failed
        // either way: redirect to the login page
        // either the `token` cookie didn't exist
        // or token verification failed
        // either way: redirect to the login page
        response.data.accountSaving.errors.push({
          field: 'auth',
          message: 'you are not authorized'
        })
        return res.status(403).json({ response })
      }
    }

    return res.status(400).json({ response })

  } else {
    // Handle any other HTTP method
    return res.status(400).json({ error: 'ENDPOINT with this method isn\'t exists' })
  }
}

export default UserProfileHandler
