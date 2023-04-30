import React, { ReactElement } from "react"
import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import nookies from "nookies"
import { useForm } from "react-hook-form"

// mui
import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"

// project components
import { AuthLayout } from "@/components/Layout"
import { AuthForm } from "@/components/Form/AuthForm/AuthForm"
import { FooterMemoized } from "@/components/Footer"
import { PasswordField as PasswordFieldComponent } from '@/components/ui-component/fields/PasswordField'

// utils
import { firebaseAdmin } from "@/lib/firebase/firebaseAdmin"

// store
import UserStore, { RegisterUserData, RegisterResponse } from "@/stores/userStore"

export interface RegisterUserDataFull extends RegisterUserData {
  repeatPassword: string,
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx)
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token)

    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      // `as never` is required for correct type inference
      // by InferGetServerSidePropsType below
      props: {} as never,
    }
  } catch (err) {
    console.error(`Registration error: ${err}`)

    return {
      props: {} as never,
    }
  }
}

function RegistrationPage() {
  const router = useRouter()
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<RegisterUserDataFull>({})

  const handleRegister = handleSubmitForm(async (formData: RegisterUserData): Promise<void> => {
    const { data }: RegisterResponse = await UserStore.register({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      repeatPassword: formData.repeatPassword,
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
        } else {
          console.error("Registration error:", e)
        }
      })

      return
    }
    // User signed in successfully.
    await router.push("/login")

    return
  })

  const NameField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        placeholder="Ваше имя"
        autoFocus
        className={"bg-white rounded"}
        {...registerForm("name", {
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
      <TextField
        margin="normal"
        required
        fullWidth
        id="phone"
        placeholder="Ваш телефон"
        className={"bg-white rounded"}
        {...registerForm("phone", {
          required: true,
        })}
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
        id="email"
        placeholder="Ваш email"
        autoComplete="email"
        className={"bg-white rounded"}
        {...registerForm("email", {
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
        id="password"
        label={null}
        registerFormFunc={registerForm("password",{
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
        id="repeatPassword"
        label={null}
        registerFormFunc={registerForm("repeatPassword",{
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
      <div className={"h-screen flex justify-center items-center"}>
        <div className={"h-full flex flex-col"}>
          <div className={"flex-[0.1]"}>
            <div></div>
          </div>

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

          <FooterMemoized />
        </div>
      </div>
    </>
  )
}

RegistrationPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>
}

export default RegistrationPage
