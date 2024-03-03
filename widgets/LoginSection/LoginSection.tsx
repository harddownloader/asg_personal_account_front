import { ReactElement, useEffect } from "react"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import nookies from "nookies"
import { useForm } from "react-hook-form"
import * as Sentry from "@sentry/nextjs"

// mui
import Container from "@mui/material/Container"
import TextField from '@mui/material/TextField'

// project components
import { AuthForm } from '@/widgets/Form'
import { AuthLayout } from "@/widgets/Layout/AuthLayout/AuthLayout"
import { FooterMemoized } from "@/widgets/Footer"
import { PasswordField as PasswordFieldComponent } from '@/shared/ui/fields/PasswordField'

// shared
import { ACCESS_TOKEN_KEY, AUTHORIZATION_HEADER_KEY } from "@/shared/lib/providers/auth"
import { isTokenExpire, parseJwtOnServer } from "@/shared/lib/token"
import { API_URI } from "@/shared/const"
import { pagesPath } from "@/shared/lib/$path"
import { destroyAccessToken } from "@/shared/lib/cookies"

// store
import { UserStore } from "@/entities/User"
import type { IUserOfDB } from '@/entities/User'

export interface ILoginFormData {
  email: string
  password: string
}

export const LoginSection = () => {
  const router = useRouter()

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<ILoginFormData>({})

  const handleLogin = handleSubmitForm(async (formData: ILoginFormData):Promise<void> => {
    const { data } = await UserStore.login({
      email: formData.email,
      password: formData.password,
    })

    if (data?.tokenCreate?.errors[0]) {
      // Unable to sign in.
      setErrorForm("email", { message: "Не валидные данные входа" })

      return
    }

    await console.log('redirect to home page')
    // if (!data.tokenCreate.currentUser.region) setErrorForm(...)
    await router.push(pagesPath.home.$url().pathname)
    // await router.push({
    //   pathname: "/",
    //   query: { region: 'ua' } // data.tokenCreate.currentUser.region
    // })

    return
  })

  const LoginField: ReactElement = (
    <TextField
      margin="normal"
      required
      fullWidth
      id="email"
      placeholder="Логин"
      autoComplete="email"
      autoFocus
      className={"bg-white rounded"}
      {...registerForm("email", {
        required: true,
      })}
    />
  )

  const PasswordField: ReactElement = (
    <>
      <PasswordFieldComponent
        placeholder="Пароль"
        id="password"
        label={null}
        registerFormFunc={registerForm("password",{
          required: true,
        })}
        errorsFormJSX={null}
      />
    </>
  )

  return (
    <>
      <div className={"flex-1 flex items-center"}>
        <div>
          <AuthForm
            submitBtnText={"Войти"}
            handleSubmit={handleLogin}
            fields={[
              LoginField,
              PasswordField
            ]}
            UnderTheButton={
              <>
                {!!errorsForm.email && (
                  <p className="text-sm text-red-500 pt-2">{errorsForm.email?.message}</p>
                )}
              </>
            }
          />
          <Container maxWidth="xs" className={"my-4 flex justify-between"}>
            <div>
              {/*<Link href="#" className={'text-brand underline'}>*/}
              {/*  {"Забыл пароль"}*/}
              {/*</Link>*/}
            </div>
            <div>
              <Link href="/registration" className={'text-brand underline'}>
                {"Зарегистрироваться"}
              </Link>
            </div>
          </Container>
        </div>
      </div>
    </>
  )
}
