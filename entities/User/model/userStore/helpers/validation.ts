import {
  checkEmail,
  checkName,
  checkPhone,
  checkPassword,
  checkRepeatPassword,
  checkCity,
  checkCargoCustomIdentify,
  checkClientCode,
  checkCargoStatus,
  checkCargoCostOfDelivery,
  // checkCargoName,
  checkCargoInsurance,
  checkCargoCost,
  checkCargoTariff,
  checkCargoId,
  checkPasswordByReAuthentication, checkUserId, checkCargoTone,
} from "@/shared/lib/validation/fields/conditions"

// types
import {
  TUserEmail,
  TUserName,
  TUserPhone,
  TUserPassword,
  TUserCity,
  TUserId,
  TUserCountry,
  IUserOfDB,
} from "@/entities/User"
import { TResponseFieldErrorsArray } from "@/shared/types/types"
import {
  TCargoClientCode,
  TCargoCostOfDelivery,
  TCargoCost,
  TCargoCustomIdentify,
  TCargoID,
  TCargoInsurance,
  TCargoTariff,
  TCargoStatus,
} from "@/entities/Cargo"
import { TAccessToken } from "@/entities/User"
import { TCargoToneId } from "@/entities/Cargo/types"

export const  checkContactUserDataFields = async ({
                                             name,
                                             phone,
                                             email,
                                             city,
                                             responseErrorsArray,
                                             id,
                                             country,
                                             token
                                           }: {
    name: TUserName
    email: TUserEmail
    phone: TUserPhone
    city: TUserCity
    responseErrorsArray: TResponseFieldErrorsArray,
    id: TUserId,
    country: TUserCountry,
    token: TAccessToken | undefined,
}) => {
  await checkUserId({
    id,
    country,
    token,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'server',
    errorMessage: 'Что-то пошло не так (проблема с нахождением пользователя)'
  })

  await checkName({
    name,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'name',
    errorMessage: 'Введите имя'
  })

  await checkPhone({
    phone,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'phone',
    errorMessage: 'Не валидный телефон'
  })

  await checkEmail({
    email,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'email',
    errorMessage: 'Не валидный email'
  })

  await checkCity({
    city,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'city',
    errorMessage: 'Введите пожалуйста город'
  })
}

export const checkNewPasswordFields = async ({
                                  currentPassword,
                                  newPassword,
                                  repeatNewPassword,
                                  responseErrorsArray,
                                }: {
  currentPassword: TUserPassword
  newPassword: TUserPassword
  repeatNewPassword: TUserPassword
  responseErrorsArray: TResponseFieldErrorsArray
}) => {
  await checkPassword({
    password: currentPassword,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'currentPassword',
    errorMessage: 'Текущий пароль введен не корректно'
  })

  await checkPasswordByReAuthentication({
    password: currentPassword,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'currentPassword',
    errorMessage: 'Текущий пароль введен не верно'
  })

  await checkPassword({
    password: newPassword,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'newPassword',
    errorMessage: 'Пароль должен быть от 8 символов'
  })

  await checkRepeatPassword({
    password: newPassword,
    repeatPassword: repeatNewPassword,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'repeatNewPassword',
    errorMessage: 'Пароли не совпадают'
  })
}

export const checkRegistrationFields = ({
                                          name,
                                          phone,
                                          email,
                                          password,
                                          repeatPassword,
                                          responseErrorsArray
                                        }: {
  name: TUserName
  phone: TUserPhone
  email: TUserEmail
  password: TUserPassword
  repeatPassword: TUserPassword
  responseErrorsArray: TResponseFieldErrorsArray
}) => {
  checkName({
    name,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'name',
    errorMessage: 'Введите имя'
  })

  checkPhone({
    phone,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'phone',
    errorMessage: 'Не валидный телефон'
  })

  checkEmail({
    email,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'email',
    errorMessage: 'Не валидный email'
  })

  checkPassword({
    password,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'password',
    errorMessage: 'Пароль должен быть от 8 символов'
  })

  checkRepeatPassword({
    password,
    repeatPassword,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'repeatPassword',
    errorMessage: 'Пароли не совпадают'
  })
}

export const checkEditClientByManagerFields = async ({
                                                 name,
                                                 phone,
                                                 email,
                                                 city,
                                                 responseErrorsArray,
                                                 id,
                                                 country,
                                                 token,
                                               }: {
  name: TUserName
  email: TUserEmail
  phone: TUserPhone
  city: TUserCity
  responseErrorsArray: TResponseFieldErrorsArray,
  id: TUserId,
  country: TUserCountry,
  token: TAccessToken | undefined
}) => {
  await checkUserId({
    id,
    country,
    token,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'server',
    errorMessage: 'Что-то пошло не так (проблема с нахождением пользователя)'
  })

  await checkName({
    name,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'name',
    errorMessage: 'Введите имя'
  })

  await checkPhone({
    phone,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'phone',
    errorMessage: 'Не валидный телефон'
  })

  await checkEmail({
    email,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'email',
    errorMessage: 'Не валидный email'
  })

  await checkCity({
    city,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'city',
    errorMessage: 'Введите пожалуйста город'
  })
}

export const checkAddCargoFields = async ({
                                      toneId,
                                      clientCode,
                                      status,
                                      costOfDelivery,
                                      // cargoName,
                                      insurance,
                                      cost,
                                      tariff,
                                      responseErrorsArray,
                                      userId,
                                      country,
                                      token,
                                    }: {
  toneId: TCargoToneId
  clientCode: TCargoClientCode
  status: TCargoStatus
  costOfDelivery: TCargoCostOfDelivery
  // cargoName: CargoNameType
  insurance: TCargoInsurance
  cost: TCargoCost
  tariff: TCargoTariff
  responseErrorsArray: TResponseFieldErrorsArray,
  userId: TUserId | null | undefined,
  country: TUserCountry | undefined,
  token: TAccessToken | undefined,
}): Promise<IUserOfDB | null> => {
  const user: IUserOfDB | null = await checkUserId({
    id: userId,
    country,
    token,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'server',
    errorMessage: 'Что-то пошло не так (проблема с нахождением пользователя)'
  })

   await checkCargoTone({
     toneId,
     responseErrorsArray,
     fieldName: 'toneId',
     errorMessage: 'Выберите пожалуйста тонну'
   })

  await checkClientCode({
    clientCode,
    responseErrorsArray,
    fieldName: 'clientCode',
    errorMessage: 'Не корректный код клиента',
  })

  await checkCargoStatus({
    status,
    responseErrorsArray,
    fieldName: 'status',
    errorMessage: 'Не корректный статус',
  })

  await checkCargoCostOfDelivery({
    costOfDelivery,
    responseErrorsArray,
    fieldName: 'costOfDelivery',
    errorMessage: 'Не корректная стоимость доставки',
  })

  // await checkCargoName({
  //   cargoName,
  //   responseErrorsArray,
  //   fieldName: 'cargoName',
  //   errorMessage: 'Не корректное название груза',
  // })

  await checkCargoInsurance({
    insurance,
    responseErrorsArray,
    fieldName: 'insurance',
    errorMessage: 'Не корректная страховка',
  })

  await checkCargoCost({
    cost,
    responseErrorsArray,
    fieldName: 'cost',
    errorMessage: 'Не корректная стоимость',
  })

  await checkCargoTariff({
    tariff,
    responseErrorsArray,
    fieldName: 'tariff',
    errorMessage: 'Не корректный тариф',
  })

  return user
}

export const checkUpdateCargoFields = async ({
                                        toneId,
                                         clientCode,
                                         status,
                                         costOfDelivery,
                                         // cargoName,
                                         insurance,
                                         cost,
                                         tariff,
                                         id,
                                         responseErrorsArray,
                                         userId,
                                         country,
                                         token,
                                       }: {
  toneId: TCargoToneId
  clientCode: TCargoClientCode
  status: TCargoStatus
  costOfDelivery: TCargoCostOfDelivery
  // cargoName: CargoNameType
  insurance: TCargoInsurance
  cost: TCargoCost
  tariff: TCargoTariff
  id: TCargoID
  responseErrorsArray: TResponseFieldErrorsArray,
  userId: TUserId | null | undefined,
  country: TUserCountry | undefined,
  token: TAccessToken | undefined,
}) => {
  const user: IUserOfDB | null = await checkUserId({
    id: userId,
    country,
    token,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'server',
    errorMessage: 'Что-то пошло не так (проблема с нахождением пользователя)'
  })

  await checkCargoTone({
    toneId,
    responseErrorsArray,
    fieldName: 'toneId',
    errorMessage: 'Выберите пожалуйста тонну'
  })

  await checkClientCode({
    clientCode,
    responseErrorsArray,
    fieldName: 'clientCode',
    errorMessage: 'Не корректный код клиента',
  })

  await checkCargoStatus({
    status,
    responseErrorsArray,
    fieldName: 'status',
    errorMessage: 'Не корректный статус',
  })

  await checkCargoCostOfDelivery({
    costOfDelivery,
    responseErrorsArray,
    fieldName: 'costOfDelivery',
    errorMessage: 'Не корректная стоимость доставки',
  })

  // await checkCargoName({
  //   cargoName,
  //   responseErrorsArray,
  //   fieldName: 'cargoName',
  //   errorMessage: 'Не корректное название груза',
  // })

  await checkCargoInsurance({
    insurance,
    responseErrorsArray,
    fieldName: 'insurance',
    errorMessage: 'Не корректная страховка',
  })

  await checkCargoCost({
    cost,
    responseErrorsArray,
    fieldName: 'cost',
    errorMessage: 'Не корректная стоимость',
  })

  await checkCargoTariff({
    tariff,
    responseErrorsArray,
    fieldName: 'tariff',
    errorMessage: 'Не корректный тариф',
  })

  await checkCargoId({
    id,
    responseErrorsArray,
    fieldName: 'client',
    errorMessage: 'Что то пошло не так. Попробуейте перезагрузить страницу и повторить.',
  })

  return user
}
