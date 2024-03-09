import { makeAutoObservable } from "mobx"
import { firebaseAuth, firebaseFirestore } from "@/shared/lib/firebase"
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"
import nookies from "nookies"
import { doc, setDoc } from "firebase/firestore"
import { io } from "socket.io-client"
import * as Sentry from '@sentry/nextjs'

// shared
import {
  API_URI,
  SOCKET_SERVER_PATH,
  SOCKET_SERVER_URL,
} from "@/shared/const"
import { cookiesOptions, getCookies } from "@/shared/lib/cookies"

// helpers
import {
  checkContactUserDataFields,
  checkNewPasswordFields,
  checkRegistrationFields,
} from "@/entities/User/model/userStore/helpers/validation"

// types
import type {
  TLoginResponse,
  TRegisterResponse,
  IRegisterUserData,
  IUserOfDB,
  TUserPasswordSavingResponse,
  IUserSecurityDataForSaving,
  IUserStore,
  TUserSavingResponse,
  TUserOfAnExistingRegion,
} from "@/entities/User"
import type { ILoginFormData } from "@/widgets/LoginSection"
import type { TFixMeInTheFuture } from "@/shared/types/types"
import { ISaveContactUserDataArgs } from "@/entities/User"

// entity
import { getUpdateUserErrorMsg, registerUser, updateUserData } from "@/entities/User"

// const
import {
  USERS_DB_COLLECTION_NAME,
  USER_ROLE,
  USER_DEFAULT_VALUES,
} from "@/entities/User"
import { ACCESS_TOKEN_KEY, AUTHORIZATION_HEADER_KEY } from "@/shared/lib/providers/auth"

// stores
import { CargosStore } from "@/entities/Cargo"
import { NotificationsStore } from "@/entities/Notification"
import { checkTokenExpireErrorMsg } from "@/shared/lib/exceptions/isFetchWasFailedByTokenExpire"
import { pagesPath } from "@/shared/lib/$path"

let socket: TFixMeInTheFuture

export class _UserStore {
  user: IUserStore = {
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
                       country,
                     }: IUserOfDB): void => {
    this.user.currentUser = {
      id,
      name,
      email,
      phone,
      city,
      role,
      userCodeId,
      country
    }
  }

  saveContactUserData = async ({
                                  name,
                                  phone,
                                  email,
                                  city,
                                  id,
                                  userCodeId,
                                  country,
                               }: ISaveContactUserDataArgs) => {
    const token = await getCookies(ACCESS_TOKEN_KEY)
    const response: TUserSavingResponse = {
      data: {
        accountSaving: {
          errors: []
        }
      }
    }

    await checkContactUserDataFields({
      name,
      phone,
      email,
      city,
      responseErrorsArray: response.data.accountSaving.errors,
      id,
      country,
      token,
    })

    if (!response.data.accountSaving.errors.length) {
      this.user.isLoading = true
      await updateUserData({
        country,
        id,
        token: token as string,
        name,
        phone,
        email,
        city,
        userCodeId,
      }).catch((errorMessage) => {
        if (Array.isArray(errorMessage.message)) {
          errorMessage.message.forEach((msg: string) => {
            response.data.accountSaving.errors.push(
              getUpdateUserErrorMsg(msg)
            )
          })
        } else {
          response.data.accountSaving.errors.push(
            getUpdateUserErrorMsg(errorMessage.message)
          )
        }
      }).finally(() => {
        this.user.isLoading = false
      })
    }

    return response
  }

  saveNewPassword = async ({
                             currentPassword,
                             newPassword,
                             repeatNewPassword,
                             id,
                             country,
                           }: IUserSecurityDataForSaving): Promise<TUserPasswordSavingResponse> => {
    const token = await getCookies(ACCESS_TOKEN_KEY)
    const response: TUserPasswordSavingResponse = {
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

    if (!response.data.accountSaving.errors.length) {
      try {
        const updatedUserData = await fetch(`${API_URI}users/${country}/${id}`, {
          method: 'PATCH',
          headers: new Headers({
            'Content-Type': 'application/json',
            [`${AUTHORIZATION_HEADER_KEY}`]: `Bearer ${token}`
          }),
          credentials: "same-origin",
          body: JSON.stringify({
            password: newPassword,
            id
          })
        })
          .then((response) => response.json())
          .then((res) => res)
          .catch((error) => {
            console.error(error)
            Sentry.captureException(error)
          })
          .finally(() => {
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

  login = async ({ email, password }: ILoginFormData): Promise<TLoginResponse> => {
    const response: TLoginResponse = {
      data: {
        tokenCreate: {
          errors: []
        }
      }
    }
    this.user.isLoading = true

    const resp = await fetch(`${API_URI}auth/signin`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        // [`${AUTHORIZATION_HEADER_KEY}`]: `Bearer ${token}`
      }),
      body: JSON.stringify({
        email,
        password
      })
    })
      .then((res) => res.json())
      .catch((error) => {
        response.data.tokenCreate.errors.push({
          field: 'server',
          message: `Server auth error: code - ${error.code}, error_mgs - ${error.message}`
        })
        this.user.isLoading = false
      })

    if (resp?.accessToken) {
      await nookies.destroy(null, ACCESS_TOKEN_KEY)
      await nookies.set(null, ACCESS_TOKEN_KEY, resp.accessToken, cookiesOptions.accessToken)
      /*
      * sing in with custom token on the frontend
      * https://firebase.google.com/docs/auth/admin/create-custom-tokens?hl=ru#sign_in_using_custom_tokens_on_clients
      * */
      const auth = await getAuth()
      await signInWithCustomToken(auth, resp.accessToken)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user

          return user
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message

          return null
        });

    } else {
      console.error('assessToken not found')
      Sentry.captureMessage(
        `something wrong with getting token in UserStore.login(), assessToken:${resp?.accessToken}`
      )
    }

    return response
  }

  register = async ({
                      name,
                      phone,
                      email,
                      country,
                      password,
                      repeatPassword,
  }: IRegisterUserData & { country: TUserOfAnExistingRegion } ): Promise<TRegisterResponse> => {

    const response: TRegisterResponse = {
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

    if (response.data.accountRegister.errors.length) return response

    this.user.isLoading = true

    await registerUser({
      name,
      phone,
      email,
      country,
      password,
    }).then((regUser) => {
      if (regUser?.tokens?.accessToken && typeof regUser.tokens.accessToken === 'string') {
        nookies.destroy(null, ACCESS_TOKEN_KEY)
        nookies.set(null, ACCESS_TOKEN_KEY, regUser.tokens.accessToken, cookiesOptions.accessToken)

        // socket.on('connect', () => {
        //   console.log('socket connected from register method')
        //   socket.emit('newUser', `${name}, ${email}`)
        // })
      } else Sentry.captureMessage('we cant get access token after registration of new user')

    }).catch((error) => {
      console.log({error, 'error.message': error.message})
      if (error.message === 'TOO_LONG') response.data.accountRegister.errors.push({
        field: 'phone',
        message: `Не валидный номер телефона - слишком длинный`
      })
      if (error.message === 'TOO_SHORT') response.data.accountRegister.errors.push({
        field: 'phone',
        message: `Не валидный номер телефона - слишком меленький`
      })
      if (error.message === "The email address is already in use by another account.") {
        response.data.accountRegister.errors.push({
          field: "email",
          message: 'Уже есть аккаунт с таким email'
        })
      }
      if (error.message === "The phone number must be a non-empty E.164 standard compliant identifier string.") {
        response.data.accountRegister.errors.push({
          field: "phone",
          message: 'Не валидный телефон'
        })
      }

      // default
      if (!response.data.accountRegister.errors.length) {
        response.data.accountRegister.errors.push({
          field: "serverError",
          message: 'Что-то пошло не так, попробуйте позже.'
        })
      }
    }).finally(() => {
      this.user.isLoading = false
    })

    return response
  }

  async logout() {
    // before
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

    // after
    // const token = await getCookies(ACCESS_TOKEN_KEY)
    // const logoutRes = await fetch(`${API_URI}auth/logout`, {
    //   method: 'GET',
    //   headers: new Headers({
    //     'Content-Type': 'application/json',
    //     [`${AUTHORIZATION_HEADER_KEY}`]: `Bearer ${token}`
    //   }),
    //   credentials: "same-origin",
    // })
    //   .then(res => res.json())
    //   .catch((error) => {
    //     console.error('logout was failed')
    //
    //     return null
    //   })
    //
    // return logoutRes
  }
}
