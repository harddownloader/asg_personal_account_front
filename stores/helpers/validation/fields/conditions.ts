import { responseFieldErrorsArray } from "@/lib/types"
import {
  UserEmail,
  UserName,
  UserPhone,
  passwordType,
  UserCityType
} from "@/stores/userStore/types"
import { validateEmail } from "@/lib/validation/email"
import {
  CargoClientCodeType,
  CargoCostOfDeliveryType,
  CargoCostType,
  CargoCustomIdentify,
  CargoID,
  CargoInsuranceType,
  CargoNameType,
  CargoShippingDateType,
  CargoStatusType,
} from "@/stores/cargosStore/types"

// export const getNameCondition = (name: string) => !name || name.length < 2
//
// export const checker = ({
//                           value,
//                           responseErrorsArray,
//                           fieldName,
//                           errorMessage,
//                         }: {
//   value: string,
//   responseErrorsArray: responseFieldErrorsArray,
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
  responseErrorsArray: responseFieldErrorsArray
  fieldName: string
  errorMessage: string
}

export const checkName = ({
                                name,
                                responseErrorsArray,
                                fieldName,
                                errorMessage,
                              }: commonArgsForCheckType & { name: UserName }) => {
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
                           }: commonArgsForCheckType & { phone: UserPhone }) => {
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
                           }: commonArgsForCheckType & { email: UserEmail }) => {
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
                              }: commonArgsForCheckType & { password: passwordType }) => {
  if (!password || password.length < 8) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkRepeatPassword = ({
                                      password,
                                      repeatPassword,
                                      responseErrorsArray,
                                      fieldName,
                                      errorMessage,
                                    }: commonArgsForCheckType & {
  password: passwordType
  repeatPassword: passwordType
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
                          }: commonArgsForCheckType & { city: UserCityType }) => {
  if (!city || city.length < 2) {
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
                             }: commonArgsForCheckType & { cargoId: CargoCustomIdentify }) => {
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
}: commonArgsForCheckType & { clientCode: CargoClientCodeType }) => {
  if (!clientCode || clientCode.length < 2) {
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
}: commonArgsForCheckType & { status: CargoStatusType }) => {
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
}: commonArgsForCheckType & { costOfDelivery: CargoCostOfDeliveryType }) => {
  if (!costOfDelivery || costOfDelivery.length < 0) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkCargoName = ({
                               cargoName,
                               responseErrorsArray,
                               fieldName,
                               errorMessage,
}: commonArgsForCheckType & { cargoName: CargoNameType }) => {
  if (!cargoName || cargoName.length < 2) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkCargoInsurance = ({
                                    insurance,
                                    responseErrorsArray,
                                    fieldName,
                                    errorMessage,
}: commonArgsForCheckType & { insurance: CargoInsuranceType }) => {
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
}: commonArgsForCheckType & { cost: CargoCostType }) => {
  if (!cost || Number(cost) < 0) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}

export const checkCargoShippingData = ({
                                       shippingDate,
                                       responseErrorsArray,
                                       fieldName,
                                       errorMessage,
}: commonArgsForCheckType & { shippingDate: CargoShippingDateType }) => {
  if (!shippingDate || shippingDate.length < 4) {
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
}: commonArgsForCheckType & { id: CargoID }) => {
  if (!id || id.length < 2) {
    responseErrorsArray.push({
      field: fieldName,
      message: errorMessage
    })
  }
}
