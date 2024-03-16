import React, { ReactElement, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { observer } from "mobx-react-lite"
import * as Sentry from "@sentry/nextjs"
import { useForm } from "react-hook-form"
// flags select
import 'react-phone-number-input/style.css'
import { CountryCode } from "libphonenumber-js/min"

// mui
import {
  Container,
  TextField,
} from "@mui/material"

// project components
import { AuthForm } from "@/widgets/Form/AuthForm/AuthForm"
import { PasswordField as PasswordFieldComponent } from '@/shared/ui/fields/PasswordField'
import { PhoneFieldComponent } from "@/widgets/Registration/PhoneInput"

// shared
import { useDetectUserLocation } from "@/shared/lib/hooks/useDetectUserLocation"
import { pagesPath } from "@/shared/lib/$path"
import { useAuthLoaderController } from "@/shared/lib/hooks/useAuthLoaderController"

// store
import { UserStore } from "@/entities/User"
import type {
  IRegisterUserData,
  TRegisterResponse,
} from '@/entities/User'

// assets
import classes from './Registration.module.scss'

export interface IRegisterUserDataFull extends IRegisterUserData {
  repeatPassword: string,
  serverError: void | undefined
}

const NAME_FIELD_NAME = 'name'
export const PHONE_FIELD_NAME = 'phone'
export const COUNTRY_FIELD_NAME = 'country'
const EMAIL_FIELD_NAME = 'email'
const PASSWORD_FIELD_NAME = 'password'
const REPEAT_PASSWORD_FIELD_NAME = 'repeatPassword'

export type TCountryState = null | CountryCode

export const Registration = observer(() => {
  const router = useRouter()
  useAuthLoaderController()

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
    control: controlForm,
    reset: resetForm,
    getValues
  } = useForm<IRegisterUserDataFull>({
    defaultValues: {
      [`${NAME_FIELD_NAME}`]: '',
      [`${PHONE_FIELD_NAME}`]: '',
      [`${COUNTRY_FIELD_NAME}`]: '',
      [`${EMAIL_FIELD_NAME}`]: '',
      [`${PASSWORD_FIELD_NAME}`]: '',
      [`${REPEAT_PASSWORD_FIELD_NAME}`]: '',
    }
  })

  const [country, setCountry] = useState<TCountryState>(null)

  useDetectUserLocation((country_code: CountryCode) => {
    resetForm({
      [`${COUNTRY_FIELD_NAME}`]: country_code
    })
    setCountry(country_code)
  }, console.log)

  const handleRegister = handleSubmitForm(async (formData: IRegisterUserData): Promise<void> => {
    const { data }: TRegisterResponse = await UserStore.register({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      repeatPassword: formData.repeatPassword,
      country: formData.country.toLowerCase(),
    })

    if (data?.accountRegister?.errors.length) {
      // Unable to sign in.
      data?.accountRegister?.errors.forEach((e) => {
        if (e.field === "name") {
          setErrorForm("name", { message: e.message! })
        } else if (e.field === "phone") {
          setErrorForm("phone", { message: e.message! })
        } else if (e.field === "email") {
          setErrorForm("email", { message: e.message! })
        } else if (e.field === "password") {
          setErrorForm("password", { message: e.message! })
        } else if (e.field === 'repeatPassword') {
          setErrorForm("repeatPassword", { message: e.message! })
        } else if (e.field === "serverError") {
          setErrorForm("serverError", { message: e.message! })
        } else {
          console.error("Registration error:", e)
        }
      })

      return
    }

    await router.push(pagesPath.home.$url().pathname)

    return
  })

  const NameField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id={NAME_FIELD_NAME}
        placeholder="Ваше имя"
        autoFocus
        className={classes.text_field}
        {...registerForm(NAME_FIELD_NAME, {
          required: true,
        })}
      />
      {!!errorsForm.name && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.name?.message}</p>
      )}
    </>
  )

  const PhoneField: ReactElement = <PhoneFieldComponent
    controlForm={controlForm}
    errorsForm={errorsForm}
    country={country}
    setCountryHandler={(newValue) => setCountry(newValue)}
    className={classes.text_field}
  />

  const LoginField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id={EMAIL_FIELD_NAME}
        placeholder="Ваш email"
        autoComplete={EMAIL_FIELD_NAME}
        className={classes.text_field}
        {...registerForm(EMAIL_FIELD_NAME, {
          required: true,
        })}
      />
      {!!errorsForm.email && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.email?.message}</p>
      )}
    </>
  )

  const PasswordField: ReactElement = (
    <>
      <PasswordFieldComponent
        placeholder="Ваш пароль"
        id={PASSWORD_FIELD_NAME}
        className={classes.text_field}
        label={null}
        registerFormFunc={registerForm(PASSWORD_FIELD_NAME,{
          required: true,
        })}
        errorsFormJSX={<>
          {!!errorsForm.password && (
            <p className="text-sm text-red-500 pt-2">{errorsForm.password?.message}</p>
          )}
        </>}
      />
    </>
  )

  const RepeatPasswordField: ReactElement = (
    <>
      <PasswordFieldComponent
        placeholder="Повторите ваш пароль"
        id={REPEAT_PASSWORD_FIELD_NAME}
        className={classes.text_field}
        label={null}
        registerFormFunc={registerForm(REPEAT_PASSWORD_FIELD_NAME,{
          required: true,
        })}
        errorsFormJSX={<>
          {!!errorsForm.repeatPassword && (
            <p className="text-sm text-red-500 pt-2">{errorsForm.repeatPassword?.message}</p>
          )}
        </>}
      />
    </>
  )

  return (
    <>
      <div className={"flex-1 flex items-center"}>
        <div className={""}>
          <AuthForm
            submitBtnText={"Зарегистрироваться"}
            handleSubmit={handleRegister}
            fields={[
              NameField,
              PhoneField,
              LoginField,
              PasswordField,
              RepeatPasswordField
            ]}
          />

          {/* showing server errors */}
          <Container maxWidth="xs" className={"my-4 flex justify-between"}>
          {!!errorsForm.serverError && (
            <p className="text-sm text-red-500 pt-2">{errorsForm.serverError?.message}</p>
          )}
          </Container>

          {/* additional buttons */}
          <Container maxWidth="xs" className={"my-4 flex justify-between"}>
            <div>
              {/*<Link href="#" className={'text-brand underline'}>*/}
              {/*  {"Забыл пароль"}*/}
              {/*</Link>*/}
            </div>
            <div>
              <Link href="/login" className={'text-brand underline'}>
                {"Уже есть аккаунт"}
              </Link>
            </div>
          </Container>
        </div>
      </div>
    </>
  )
})
