import React, { ReactElement, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import * as Sentry from "@sentry/nextjs"
import { useForm, Controller } from "react-hook-form"
// flags select
import 'react-phone-number-input/style.css'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
// @ts-ignore
import ru from 'react-phone-number-input/locale/ru'

// mui
import {
  Container,
  TextField,
  MenuItem,
  FormControl,
} from "@mui/material"
import Select from '@mui/material/Select'

// project components
import { AuthForm } from "@/widgets/Form/AuthForm/AuthForm"
import { PasswordField as PasswordFieldComponent } from '@/shared/ui/fields/PasswordField'

// shared
import { useDetectUserLocation } from "@/shared/lib/hooks/useDetectUserLocation"
import { pagesPath } from "@/shared/lib/$path"

// store
import { UserStore } from "@/entities/User"
import type {
  IRegisterUserData,
  TRegisterResponse,
  IUserOfDB
} from '@/entities/User'

// assets
import classes from '@/shared/styles/pages/registration.module.scss'
import nookies from "nookies";
import {cookiesOptions} from "@/shared/lib/cookies";
import {ACCESS_TOKEN_KEY} from "@/shared/lib/providers/auth";

export interface IRegisterUserDataFull extends IRegisterUserData {
  repeatPassword: string,
  serverError: void | undefined
}

export type TUserCountryProperties = {
  selected: string
  detectedByIp: string
}

const NAME_FIELD_NAME = 'name'
const PHONE_FIELD_NAME = 'phone'
const COUNTRY_FIELD_NAME = 'country'
const EMAIL_FIELD_NAME = 'email'
const PASSWORD_FIELD_NAME = 'password'
const REPEAT_PASSWORD_FIELD_NAME = 'repeatPassword'

export const Registration = () => {
  const router = useRouter()
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetch("https://ipapi.co/json")
        .then(res => res.json())
        .then(userIpRes => {
          resetForm({
            [`${COUNTRY_FIELD_NAME}`]: userIpRes.country_code
          })
        })
        .catch((e) => console.error("Fetching Error: fetch for getting info about users country is down", {e}))
    }
  }, [])

  useDetectUserLocation(console.log, console.log)
  const countryCodes = getCountries()

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
        className={"bg-white rounded"}
        {...registerForm(NAME_FIELD_NAME, {
          required: true,
        })}
      />
      {!!errorsForm.name && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.name?.message}</p>
      )}
    </>
  )

  const PhoneField: ReactElement = (
    <>
      <Controller
        name={PHONE_FIELD_NAME}
        control={controlForm}
        render={({
                   field: { onChange, onBlur, value, name, ref },
                   fieldState: { invalid, isTouched, isDirty, error },
                   formState,
                 }) => (
          <TextField
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            value={value}
            ref={ref}
            id={PHONE_FIELD_NAME}
            placeholder="+33153674000" // Ваш телефон
            className={classes.phoneNumberTextField}
            margin="normal"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <FormControl>
                  <Controller
                    name={COUNTRY_FIELD_NAME}
                    control={controlForm}
                    render={({
                               field: { onChange, onBlur, value, name, ref },
                               fieldState: { invalid, isTouched, isDirty, error },
                               formState,
                             }) => (
                      <Select
                        onBlur={onBlur}
                        onChange={onChange}
                        value={value}
                        inputRef={ref}
                        labelId={`${PHONE_FIELD_NAME}-${COUNTRY_FIELD_NAME}-flag`}
                        label={`${COUNTRY_FIELD_NAME}-flag`}
                        id={`${COUNTRY_FIELD_NAME}-flag`}
                        name={name}
                        className={classes.countryFlagSelect}
                        renderValue={(selected) => {
                          return <Image
                            width={50}
                            height={30}
                            alt={'flag'}
                            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selected}.svg`}
                          />
                        }}
                      >
                        {countryCodes.map((countryCode) => {
                          return (
                            <MenuItem key={countryCode} value={countryCode}>
                              {ru[countryCode]} +{getCountryCallingCode(countryCode)}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    )
                    }
                  />
                </FormControl>
              )
            }}
          />
        )}
      />
      {!!errorsForm.phone && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.phone?.message}</p>
      )}
    </>
  )

  const LoginField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id={EMAIL_FIELD_NAME}
        placeholder="Ваш email"
        autoComplete={EMAIL_FIELD_NAME}
        className={"bg-white rounded"}
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
}
