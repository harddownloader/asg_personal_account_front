import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { validateEmail } from "@/shared/lib/validation/email"
import { TResponseFieldErrorsArray } from "@/shared/types/types"
import {
  TUserEmail,
  TUserName,
  TUserPhone,
  TUserPassword,
  TUserCity,
  TUserId,
  TUserCountry,
  IUserOfDB
} from "@/entities/User"
import type {
  TCargoClientCode,
  TCargoCostOfDelivery,
  TCargoCost,
  TCargoCustomIdentify,
  TCargoID,
  TCargoInsurance,
  TCargoTariff,
  TCargoStatus,
} from "@/entities/Cargo"
import { firebaseAuth } from "@/shared/lib/firebase"
import * as Sentry from "@sentry/nextjs"
import { TAccessToken } from "@/entities/User"
import { AUTHORIZATION_HEADER_KEY } from "@/shared/lib/providers/auth"

// export const getNameCondition = (name: string) => !name || name.length < 2
//
// export const checker = ({
//                           value,
//                           responseErrorsArray,
//                           fieldName,
//                           errorMessage,
//                         }: {
//   value: string,
//   responseErrorsArray: TResponseFieldErrorsArray,
//   fieldName: string,
//   errorMessage: string
// }) => {
//   if (getNameCondition(value)) {
//     responseErrorsArray.push({
//       field: fieldName,
//       message: errorMessage
//     })
//   }
// }

export type commonArgsForCheckType = {
  responseErrorsArray: TResponseFieldErrorsArray
  fieldName: string
  errorMessage: string
}

export const checkUserId = async ({
                                    id,
                                    country,
                                    token,
                                    responseErrorsArray,
                                    fieldName,
                                    errorMessage,
                                  }: commonArgsForCheckType & {
  id: TUserId | null | undefined,
  country: TUserCountry | undefined
  token: TAccessToken | undefined,
}): Promise<IUserOfDB | null> => {
  if (!id) responseErrorsArray.push({
    field: fieldName,
    message: `checkUserId: client 'id' not found, ${errorMessage}`
  })
  if (!country) responseErrorsArray.push({
    field: fieldName,
    message: `checkUserId: client 'country' not found, ${errorMessage}`
  })
  if (!token) responseErrorsArray.push({
    field: fieldName,
    message: `checkUserId: 'token' not found, ${errorMessage}`
  })

  const user = await fetch(`/api/users/${country}/${id}`, {
    headers: new Headers({
      'Content-Type': 'application/json',
      [`${AUTHORIZATION_HEADER_KEY}`]: `Bearer ${token}`
    }),
    credentials: "same-origin",
  })
    .then((res) => res.json())
    .catch((error) => {
      responseErrorsArray.push({
        field: fieldName,
        message: errorMessage
      })
      console.error(error)
      Sentry.captureException(error)
      return null
    })

  return user
}

export const checkName = ({
                                name,
                                responseErrorsArray,
                                fieldName,
                                errorMessage,
                              }: commonArgsForCheckType & { name: TUserName }) => {
  if (!name || name.length < 2) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkPhone = ({
                             phone,
                             responseErrorsArray,
                             fieldName,
                             errorMessage,
                           }: commonArgsForCheckType & { phone: TUserPhone }) => {
  if (!phone || phone.length < 5) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkEmail = ({
                             email,
                             responseErrorsArray,
                             fieldName,
                             errorMessage,
                           }: commonArgsForCheckType & { email: TUserEmail }) => {
  if (!email || !validateEmail(email)) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkPassword = ({
                                password,
                                responseErrorsArray,
                                fieldName,
                                errorMessage,
                              }: commonArgsForCheckType & { password: TUserPassword }) => {
  if (!password || password.length < 8) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkPasswordByReAuthentication = async ({
                                                  password,
                                                  responseErrorsArray,
                                                  fieldName,
                                                  errorMessage,
                                }: commonArgsForCheckType & { password: TUserPassword }) => {
  if (!firebaseAuth.currentUser || !firebaseAuth.currentUser?.email) return
  const { email } = firebaseAuth.currentUser
  const credential = EmailAuthProvider.credential(
    email, password
  )

  const reauthenticateRes = await reauthenticateWithCredential(firebaseAuth.currentUser, credential)
    .then((res) => {
      console.log({res})
      return res
    }).catch((error) => {
      console.warn('reauthenticateWithCredential catch error: ',{error})
      responseErrorsArray.push({
        field: fieldName,
        message: errorMessage
      })
    })
}

export const checkRepeatPassword = ({
                                      password,
                                      repeatPassword,
                                      responseErrorsArray,
                                      fieldName,
                                      errorMessage,
                                    }: commonArgsForCheckType & {
  password: TUserPassword
  repeatPassword: TUserPassword
}) => {
  if (password !== repeatPassword) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkCity = ({
                            city,
                            responseErrorsArray,
                            fieldName,
                            errorMessage,
                          }: commonArgsForCheckType & { city: TUserCity }) => {
  if (city && city.length < 2) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkCargoCustomIdentify = ({
                               cargoId,
                               responseErrorsArray,
                               fieldName,
                               errorMessage,
                             }: commonArgsForCheckType & { cargoId: TCargoCustomIdentify }) => {
  if (!cargoId || cargoId.length <= 2) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkClientCode = ({
                                clientCode,
                                responseErrorsArray,
                                fieldName,
                                errorMessage,
}: commonArgsForCheckType & { clientCode: TCargoClientCode }) => {
  if (!clientCode || clientCode.length < 2) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkCargoTone = ({
  toneId,
  responseErrorsArray,
  fieldName,
  errorMessage
}: commonArgsForCheckType & { toneId: string }) => {
  if (!toneId || toneId.length < 2) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkCargoStatus = ({
                                 status,
                                 responseErrorsArray,
                                 fieldName,
                                 errorMessage,
}: commonArgsForCheckType & { status: TCargoStatus }) => {
  if (status === null || status === undefined || Number(status) < 0) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkCargoCostOfDelivery = ({
                                         costOfDelivery,
                                         responseErrorsArray,
                                         fieldName,
                                         errorMessage,
}: commonArgsForCheckType & { costOfDelivery: TCargoCostOfDelivery }) => {
  if (!Number.isInteger(costOfDelivery) || costOfDelivery < 0) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

// export const checkCargoName = ({
//                                cargoName,
//                                responseErrorsArray,
//                                fieldName,
//                                errorMessage,
// }: commonArgsForCheckType & { cargoName: CargoNameType }) => {
//   if (!cargoName || cargoName.length < 2) {
//     responseErrorsArray.push({
//       field: fieldName,
//       message: errorMessage
//     })
//   }
// }

export const checkCargoInsurance = ({
                                    insurance,
                                    responseErrorsArray,
                                    fieldName,
                                    errorMessage,
}: commonArgsForCheckType & { insurance: TCargoInsurance }) => {
  if (!insurance || Number(insurance) < 0) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkCargoCost = ({
                               cost,
                               responseErrorsArray,
                               fieldName,
                               errorMessage,
}: commonArgsForCheckType & { cost: TCargoCost }) => {
  if (!cost || Number(cost) < 0) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkCargoTariff = ({
                                       tariff,
                                       responseErrorsArray,
                                       fieldName,
                                       errorMessage,
}: commonArgsForCheckType & { tariff: TCargoTariff }) => {
  if (!tariff || Number(tariff) < 0) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkCargoId = ({
                             id,
                             responseErrorsArray,
                             fieldName,
                             errorMessage,
}: commonArgsForCheckType & { id: TCargoID }) => {
  if (!id || id.length < 2) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}
