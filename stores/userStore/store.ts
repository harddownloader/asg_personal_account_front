import { makeAutoObservable } from "mobx"
import { firebaseAuth, firebaseFirestore } from "@/lib/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { io } from "socket.io-client"

// utils
import { SOCKET_SERVER_PATH, SOCKET_SERVER_URL } from "@/lib/const"

// helpers
import {
  checkContactUserDataFields,
  checkNewPasswordFields,
  checkRegistrationFields,
} from "@/stores/userStore/helpers/validation"

// types
import type {
  LoginResponse,
  RegisterResponse,
  RegisterUserData,
  UserOfDB,
  UserPasswordSavingResponse,
  UserSecurityDataForSaving,
  UserStoreInterface,
  UserSavingResponse,
} from "./types"
import type { LoginFormData } from "@/pages/login"
import type { fixMeInTheFuture } from "@/lib/types"
import { saveContactUserDataArgs } from "@/stores/userStore/types/profile/profile"

// const
import {
  USERS_DB_COLLECTION_NAME,
  USER_ROLE,
  USER_DEFAULT_VALUES,
} from "@/stores/userStore/const"

// stores
import CargosStore from "@/stores/cargosStore"
import NotificationsStore from "@/stores/notificationsStore"


let socket: fixMeInTheFuture

export class UserStore {
  user: UserStoreInterface = {
    currentUser: {...USER_DEFAULT_VALUES},
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

  saveContactUserData = async ({
                                  name,
                                  phone,
                                  email,
                                  city,
                                  id,
                                  userCodeId,
                               }: saveContactUserDataArgs) => {
    const response: UserSavingResponse = {
      data: {
        accountSaving: {
          errors: []
        }
      }
    }

    checkContactUserDataFields({
      name,
      phone,
      email,
      city,
      responseErrorsArray: response.data.accountSaving.errors,
    })

    if (!response.data.accountSaving.errors.length && firebaseAuth.currentUser) {
      this.user.isLoading = true
      const updatedUserData = await fetch("/api/userProfile", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "same-origin",
        body: JSON.stringify({
          name,
          phone,
          email,
          city,
          userCodeId,
          id
        })
      })
      .then((response) => response.json())
      .then((res) => res)
      .finally(() => {
        this.user.isLoading = false
      })
    }

    return response
  }

  saveNewPassword = async ({
                             currentPassword,
                             newPassword,
                             repeatNewPassword,
                           }: UserSecurityDataForSaving): Promise<UserPasswordSavingResponse> => {
    const response: UserPasswordSavingResponse = {
      data: {
        accountSaving: {
          errors: []
        }
      }
    }
    this.user.isLoading = true

    await checkNewPasswordFields({
      currentPassword,
      newPassword,
      repeatNewPassword,
      responseErrorsArray: response.data.accountSaving.errors,
    })

    if (
      !response.data.accountSaving.errors.length &&
      firebaseAuth.currentUser &&
      newPassword
    ) {
      try {
        await updatePassword(firebaseAuth.currentUser, newPassword).then(() => {
          // Update successful.
          console.log('password was changed')
        }).catch((error) => {
          // An error occurred
          console.error(`password wasn\'t changed, Error: ${error}`, {error})
          response.data.accountSaving.errors.push({
            field: 'server.firebase',
            message: error.code
          })
        }).finally(() => {
          this.user.isLoading = false
        })
      } catch (error) {
        this.user.isLoading = false
        console.error(`Some request was failed, Error: ${error}`, {error})
      }
    } else {
      this.user.isLoading = false
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

    checkRegistrationFields({
      name,
      phone,
      email,
      password,
      repeatPassword,
      responseErrorsArray: response.data.accountRegister.errors
    })

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
            // update user store
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
            role: USER_ROLE.CLIENT
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
        ...USER_DEFAULT_VALUES
      }
      // clear cargos
      CargosStore.clearAll()

      // clear notifications
      NotificationsStore.clearAll()

      return true
    })
  }
}
