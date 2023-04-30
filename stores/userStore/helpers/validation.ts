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
  checkCargoName,
  checkCargoInsurance,
  checkCargoCost,
  checkCargoShippingData,
  checkCargoId,
  checkPasswordByReAuthentication,
} from "@/stores/helpers/validation/fields/conditions"

// types
import {
  UserEmail,
  UserName,
  UserPhone,
  passwordType,
  UserCityType,
} from "@/stores/userStore/types"
import { responseFieldErrorsArray } from "@/lib/types"
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

export const checkContactUserDataFields = ({
                                             name,
                                             phone,
                                             email,
                                             city,
                                             responseErrorsArray
                                           }: {
    name: UserName
    email: UserEmail
    phone: UserPhone
    city: UserCityType
    responseErrorsArray: responseFieldErrorsArray
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

  checkCity({
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
  currentPassword: passwordType
  newPassword: passwordType
  repeatNewPassword: passwordType
  responseErrorsArray: responseFieldErrorsArray
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
  name: UserName
  email: UserEmail
  phone: UserPhone
  password: passwordType
  repeatPassword: passwordType
  responseErrorsArray: responseFieldErrorsArray
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

export const checkEditClientByManagerFields = ({
                                                 name,
                                                 phone,
                                                 email,
                                                 city,
                                                 responseErrorsArray
                                               }: {
  name: UserName
  email: UserEmail
  phone: UserPhone
  city: UserCityType
  responseErrorsArray: responseFieldErrorsArray
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

  checkCity({
    city,
    responseErrorsArray: responseErrorsArray,
    fieldName: 'city',
    errorMessage: 'Введите пожалуйста город'
  })
}

export const checkAddCargoFields = ({
                                      cargoId,
                                      clientCode,
                                      status,
                                      costOfDelivery,
                                      cargoName,
                                      insurance,
                                      cost,
                                      shippingDate,
                                      responseErrorsArray,
                                    }: {
  cargoId: CargoCustomIdentify
  clientCode: CargoClientCodeType
  status: CargoStatusType
  costOfDelivery: CargoCostOfDeliveryType
  cargoName: CargoNameType
  insurance: CargoInsuranceType
  cost: CargoCostType
  shippingDate: CargoShippingDateType
  responseErrorsArray: responseFieldErrorsArray
}) => {
  checkCargoCustomIdentify({
    cargoId,
    responseErrorsArray,
    fieldName: 'cargoId',
    errorMessage: 'Не корректный номер отправки',
  })

  checkClientCode({
    clientCode,
    responseErrorsArray,
    fieldName: 'clientCode',
    errorMessage: 'Не корректный код клиента',
  })

  checkCargoStatus({
    status,
    responseErrorsArray,
    fieldName: 'status',
    errorMessage: 'Не корректный статус',
  })

  checkCargoCostOfDelivery({
    costOfDelivery,
    responseErrorsArray,
    fieldName: 'costOfDelivery',
    errorMessage: 'Не корректная стоимость доставки',
  })

  checkCargoName({
    cargoName,
    responseErrorsArray,
    fieldName: 'cargoName',
    errorMessage: 'Не корректное название груза',
  })

  checkCargoInsurance({
    insurance,
    responseErrorsArray,
    fieldName: 'insurance',
    errorMessage: 'Не корректная страховка',
  })

  checkCargoCost({
    cost,
    responseErrorsArray,
    fieldName: 'cost',
    errorMessage: 'Не корректная стоимость',
  })

  checkCargoShippingData({
    shippingDate,
    responseErrorsArray,
    fieldName: 'shippingDate',
    errorMessage: 'Не корректный номер отправки',
  })
}

export const checkUpdateCargoFields = ({
                                         cargoId,
                                         clientCode,
                                         status,
                                         costOfDelivery,
                                         cargoName,
                                         insurance,
                                         cost,
                                         shippingDate,
                                         id,
                                         responseErrorsArray,
                                       }: {
  cargoId: CargoCustomIdentify
  clientCode: CargoClientCodeType
  status: CargoStatusType
  costOfDelivery: CargoCostOfDeliveryType
  cargoName: CargoNameType
  insurance: CargoInsuranceType
  cost: CargoCostType
  shippingDate: CargoShippingDateType
  id: CargoID
  responseErrorsArray: responseFieldErrorsArray
}) => {
  checkCargoCustomIdentify({
    cargoId,
    responseErrorsArray,
    fieldName: 'cargoId',
    errorMessage: 'Не корректный номер отправки',
  })

  checkClientCode({
    clientCode,
    responseErrorsArray,
    fieldName: 'clientCode',
    errorMessage: 'Не корректный код клиента',
  })

  checkCargoStatus({
    status,
    responseErrorsArray,
    fieldName: 'status',
    errorMessage: 'Не корректный статус',
  })

  checkCargoCostOfDelivery({
    costOfDelivery,
    responseErrorsArray,
    fieldName: 'costOfDelivery',
    errorMessage: 'Не корректная стоимость доставки',
  })

  checkCargoName({
    cargoName,
    responseErrorsArray,
    fieldName: 'cargoName',
    errorMessage: 'Не корректное название груза',
  })

  checkCargoInsurance({
    insurance,
    responseErrorsArray,
    fieldName: 'insurance',
    errorMessage: 'Не корректная страховка',
  })

  checkCargoCost({
    cost,
    responseErrorsArray,
    fieldName: 'cost',
    errorMessage: 'Не корректная стоимость',
  })

  checkCargoShippingData({
    shippingDate,
    responseErrorsArray,
    fieldName: 'shippingDate',
    errorMessage: 'Не корректный номер отправки',
  })

  checkCargoId({
    id,
    responseErrorsArray,
    fieldName: 'client',
    errorMessage: 'Что то пошло не так. Попробуейте перезагрузить страницу и повторить.',
  })
}
