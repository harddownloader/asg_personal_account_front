import React, { ReactElement, useState } from "react"
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { AuthLayout } from "@/components/Layout"
import { AuthForm } from "@/components/Form/AuthForm/AuthForm"
import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import { observer } from "mobx-react-lite"
import user, { RegisterUserData, RegisterResponse } from "@/stores/userStore"
import Link from "next/link"
import { Footer } from "@/components/Footer"

export const ShowUsers = observer(({user}: any) => {
  return (
    <>
      <div>
        <p>{user.user.name}</p>
      </div>
    </>
  )
})

export interface RegisterUserDataFull extends RegisterUserData {
  repeatPassword: string,
}

function RegistrationPage() {
  const router = useRouter()
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<RegisterUserDataFull>({})

  const handleRegister = handleSubmitForm(async (formData: RegisterUserData):Promise<void> => {
    const { data }: RegisterResponse = await user.register({
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
      <TextField
        margin="normal"
        required
        fullWidth
        placeholder="Ваш пароль"
        type="password"
        id="password"
        autoComplete="current-password"
        className={"bg-white rounded"}
        {...registerForm("password",{
          required: true,
        })}
      />
      {!!errorsForm.password && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.password?.message}</p>
      )}
    </>
  )

  const RepeatPasswordField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        placeholder="Повторите ваш пароль"
        type="password"
        id="repeatPassword"
        autoComplete="current-password"
        className={"bg-white rounded"}
        {...registerForm("repeatPassword", {
          required: true,
        })}
      />
      {!!errorsForm.repeatPassword && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.repeatPassword?.message}</p>
      )}
    </>
  )

  return (
    <>
      <div className={"h-screen flex justify-center items-center"}>
        <div className={"h-full flex flex-col"}>
          <div className={"flex-[0.1]"}>
            <ShowUsers user={user}/>
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

          <Footer />
        </div>
      </div>
    </>
  )
}

RegistrationPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>
}

export default RegistrationPage
