import { makeAutoObservable } from "mobx"
import { io } from "socket.io-client"
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
  signOut, getAuth,
  updatePassword,
  updateEmail,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
} from "firebase/firestore"

// utils
import { validateEmail } from "@/lib/validation/email"
import { LoginFormData } from "@/pages/login"
import { fixMeInTheFuture } from "@/lib/types"
import { firebaseAuth, firebaseFirestore } from '@/lib/firebase/firebaseClient'
import { SOCKET_SERVER_PATH, SOCKET_SERVER_URL } from "@/lib/const"

import CargosStore from '@/stores/cargosStore'
import NotificationsStore from '@/stores/notificationsStore'

export const USERS_DB_COLLECTION_NAME: string = 'users'

enum UserRoleEnum {
  CLIENT = 0,
  MANAGER = 1,
}

export const USER_ROLE_CLIENT = UserRoleEnum.CLIENT
export const USER_ROLE_MANAGER = UserRoleEnum.MANAGER

export type UserRole = UserRoleEnum

export interface UserInterface {
  name: string,
  email: string,
  phone: string
}

export type UserIdType = string
export type UserCodeIdType = string | null
export type UserCityType = string | null

export interface UserOfDB extends UserInterface {
  id: UserIdType
  userCodeId: UserCodeIdType,
  city: UserCityType,
  role: UserRole
}

export interface RegisterUserData extends UserInterface {
  password: string,
  repeatPassword: string,
}

export interface SaveClientProfileInterface extends UserInterface {
  id: UserIdType
  userCodeId: UserCodeIdType,
  city: UserCityType,
}

export interface UserSecurityDataForSaving {
  id: UserIdType
  currentPassword: string,
  newPassword: string,
  repeatNewPassword: string
}

// responses structures
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

export type UserSavingResponse = {
  data: {
    accountSaving: {
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

const userDefaultValues = {
  id: '',
  name: '',
  email: '',
  phone: '',
  city: null,
  role: USER_ROLE_CLIENT,
  userCodeId: null
}

export interface UserStoreInterface {
  currentUser: UserOfDB
  isLoading: boolean
}

let socket: fixMeInTheFuture

class UserStore {
  user: UserStoreInterface = {
    currentUser: {...userDefaultValues},
    isLoading: false,
  }

  constructor() {
    makeAutoObservable(this)
  }

  saveUserToStore = ({
                       id,
                       name,
                       email,
                       phone,
                       city,
                       role,
                       userCodeId,
                     }: UserOfDB): void => {
    this.user.currentUser = {
      id,
      name,
      email,
      phone,
      city,
      role,
      userCodeId,
    }
  }

  saveNewPassword = async ({
                             currentPassword,
                             newPassword,
                             repeatNewPassword,
                           }: UserSecurityDataForSaving): Promise<UserSavingResponse> => {
    const response: UserSavingResponse = {
      data: {
        accountSaving: {
          errors: []
        }
      }
    }

    if (!currentPassword || currentPassword.length < 8) {
      response.data.accountSaving.errors.push({
        field: 'currentPassword',
        message: 'Текущий пароль введен не корректно'
      })
    }
    if (!newPassword || newPassword.length < 8) {
      response.data.accountSaving.errors.push({
        field: 'newPassword',
        message: 'Пароль должен быть от 8 символов'
      })
    }
    if (newPassword !== repeatNewPassword) {
      response.data.accountSaving.errors.push({
        field: 'repeatNewPassword',
        message: 'Пароли не совпадают'
      })
    }

    if (!response.data.accountSaving.errors.length) {
      try {
        if (firebaseAuth.currentUser) {
          if (newPassword) await updatePassword(firebaseAuth.currentUser, newPassword).then(() => {
            // Update successful.
            console.log('password was changed')
          }).catch((error) => {
            // An error ocurred
            console.error('password wasn\'t changed')
          })
        }
      } catch (err) {
        console.error(`Some request was failed, error: ${err}`);
      }
    } else {
      response.data.accountSaving.errors.push({
        field: 'server',
        message: `firebaseAuth.currentUser is not exists`
      })

      return response
    }

    return response
  }

  login = async ({ email, password }: LoginFormData): Promise<LoginResponse> => {
    const response: LoginResponse = {
      data: {
        tokenCreate: {
          errors: []
        }
      }
    }
    this.user.isLoading = true

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
      .finally(() => {
        this.user.isLoading = false
      })

    return response
  }

  register = async ({ name, phone, email, password, repeatPassword }: RegisterUserData): Promise<RegisterResponse> => {
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
        this.user.isLoading = true

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
          // email verification
          //   await sendEmailVerification(firebaseAuth.currentUser).catch((error) => {
          //     console.error(error)
          //     response.data.accountRegister.errors.push({
          //       field: 'server',
          //       message: `sendEmailVerification was failed, error: ${error}`
          //     })
          //
          //     return error
          //   })

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

          const currentUserId = firebaseAuth.currentUser.uid
          const userRef = await doc(firebaseFirestore, USERS_DB_COLLECTION_NAME, currentUserId)
          const newUserData: UserOfDB = {
            id: currentUserId,
            name,
            phone,
            email,
            userCodeId: null,
            city: null,
            role: USER_ROLE_CLIENT
          }
          await setDoc(
            userRef,
            newUserData,
            { merge: false }
          ).then((docRef) => {
            console.log("Document written with ID: ", docRef)

            socket = io(SOCKET_SERVER_URL, {
              path: SOCKET_SERVER_PATH,
              query: {
                userId: currentUserId
              }
            })

            socket.on('connect', () => {
              console.log('socket connected from register method')
              socket.emit('newUser', `${name}, ${email}`)
            })

            return docRef
          }).catch((error) => {
            console.error("Error adding user document: ", error)
            response.data.accountRegister.errors.push({
              field: 'server',
              message: `addDoc was failed, error: ${error}`
            })

            return error
          })

          this.user.isLoading = false
        } else {
          this.user.isLoading = false
          response.data.accountRegister.errors.push({
            field: 'server',
            message: `sendEmailVerification - firebaseAuth.currentUser is not exists`
          })

          return response
        }
      } catch (err) {
        this.user.isLoading = false
        console.error(`Some request was failed, error: ${err}`)
      }
    }

    return response
  }

  logout() {
    return signOut(firebaseAuth).then((result) => {
      this.user.currentUser = {
        ...userDefaultValues
      }
      // clear cargos
      CargosStore.clearAll()

      // clear notifications
      NotificationsStore.clearAll()

      return true
    })
  }
}

export default new UserStore()
