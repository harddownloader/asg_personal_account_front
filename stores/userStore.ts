import { makeAutoObservable } from "mobx"
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
  signOut,
} from 'firebase/auth'
import { firebaseAuth, firebaseFirestore } from '@/lib/firebase'
import { collection, addDoc } from "firebase/firestore"
import { validateEmail } from "@/lib/validation/email"
import { LoginFormData } from "@/pages/login"

export interface UserInterface {
  name: string,
  email: string,
  phone: string
}

export interface RegisterUserData extends UserInterface {
  password: string,
  repeatPassword: string,
}

export type RegisterResponse = {
  data: {
    accountRegister: {
      errors: Array<{
        field: string,
        message: string
      }>
      currentUser?: FirebaseUser
    }
  }
}

export type LoginResponse = {
  data: {
    tokenCreate: {
      errors: Array<{
        field: string,
        message: string
      }>
      currentUser?: FirebaseUser
    }
  }
}

class UserStore {
  user:UserInterface = {
    name: '',
    email: '',
    phone: ''
  }

  constructor() {
    makeAutoObservable(this)
  }

  checkUserAuth = async () => {
    let authRes
    await onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        authRes = uid
        // saving user data if its not exists
      } else {
        console.error('user not authenticated')
        authRes = null
      }
    })

    return authRes ? authRes : false
  }

  login = async ({ email, password }: LoginFormData):Promise<LoginResponse> => {
    const response: LoginResponse = {
      data: {
        tokenCreate: {
          errors: []
        }
      }
    }

    await signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        response.data.tokenCreate.currentUser = user

        return user
      })
      .catch((error) => {
        response.data.tokenCreate.errors.push({
          field: 'server',
          message: `Server auth error: code - ${error.code}, error_mgs - ${error.message}`
        })

        return
      })

    return response
  }

  register = async (currentUser:RegisterUserData):Promise<RegisterResponse> => {
    const { name, phone, email, password, repeatPassword } = currentUser
    const response: RegisterResponse = {
      data: {
        accountRegister: {
          errors: []
        }
      }
    }

    if (!name || name.length < 2) {
      response.data.accountRegister.errors.push({
        field: 'name',
        message: 'Введите имя'
      })
    }
    if (!phone || phone.length < 5) {
      response.data.accountRegister.errors.push({
        field: 'phone',
        message: 'Не валидный телефон'
      })
    }
    if (!email || !validateEmail(email)) {
      response.data.accountRegister.errors.push({
        field: 'email',
        message: 'Не валидный email'
      })
    }
    if (!password || password.length < 8) {
      response.data.accountRegister.errors.push({
        field: 'password',
        message: 'Пароль должен быть от 8 символов'
      })
    }
    if (password !== repeatPassword) {
      response.data.accountRegister.errors.push({
        field: 'repeatPassword',
        message: 'Пароли не совпадают'
      })
    }

    if (!response.data.accountRegister.errors.length) {
      try {
        await createUserWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        ).then(async (userCredential) => {
          // Signed in
          const user = userCredential.user
          console.log({ thenUser: user })
          response.data.accountRegister.currentUser = user

          return user
        }).catch((error) => {
          console.error({
            errorCode: error.code,
            errorMessage: error.message
          })
          response.data.accountRegister.errors.push({
            field: 'server',
            message: `Server auth error: code - ${error.code}, error_mgs - ${error.message}`
          })

          return error
        })

        if(firebaseAuth.currentUser) {
          await sendEmailVerification(firebaseAuth.currentUser).catch((error) => {
            console.error(error)
            response.data.accountRegister.errors.push({
              field: 'server',
              message: `sendEmailVerification was failed, error: ${error}`
            })

            return error
          })
        } else {
          response.data.accountRegister.errors.push({
            field: 'server',
            message: `sendEmailVerification - firebaseAuth.currentUser is not exists`
          })

          return response
        }


        await updateProfile(
          firebaseAuth.currentUser,
          { displayName: name }
        ).then((updateProfileRes) => {
          //  update user store
          console.log({updateProfileRes})

          return updateProfileRes
        }).catch((error) => {
          console.error(error)
          response.data.accountRegister.errors.push({
            field: 'server',
            message: `updateProfile was failed, error: ${error}`
          })

          return error
        })

        await addDoc(collection(firebaseFirestore, "users"), {
          id: firebaseAuth.currentUser.uid,
          phone: phone,
          userCodeId: null,
        }).then((docRef) => {
          console.log("Document written with ID: ", docRef.id)

          return docRef
        }).catch((error) => {
          console.error("Error adding user document: ", error)
          response.data.accountRegister.errors.push({
            field: 'server',
            message: `addDoc was failed, error: ${error}`
          })

          return error
        })

      } catch (err) {
        console.error(`Some request was failed, error: ${err}`);
      }
    }

    console.warn('Need save new user data from firebase to store')
    this.user = currentUser

    return response
  }

  logout() {
    signOut(firebaseAuth).then((result) => {
      this.user = {
        name: '',
        email: '',
        phone: ''
      }
    })
  }
}

export default new UserStore()
