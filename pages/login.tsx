import React, { ReactElement } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import Container from "@mui/material/Container"
import TextField from '@mui/material/TextField'
import { AuthForm } from '@/components/Form'
import { AuthLayout } from "@/components/Layout/AuthLayout/AuthLayout"
import { Footer } from "@/components/Footer"
import { ShowUsers } from "@/pages/registration"
import user from "@/stores/userStore"

export interface LoginFormData {
  email: string;
  password: string;
}

export function LoginPage() {
  const router = useRouter()
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<LoginFormData>({});

  const handleLogin = handleSubmitForm(async (formData: LoginFormData):Promise<void> => {
    const { data } = await user.login({
      email: formData.email,
      password: formData.password,
    })
    console.log('handleLogin', data)

    if (data?.tokenCreate?.errors[0]) {
      // Unable to sign in.
      setErrorForm("email", { message: "Не валидные данные входа" })

      return
    }

    await router.push("/")

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
    <TextField
      margin="normal"
      required
      fullWidth
      placeholder="Пароль"
      type="password"
      id="password"
      autoComplete="current-password"
      className={"bg-white rounded"}
      {...registerForm("password", {
        required: true,
      })}
    />
  )

  return (
    <>
      <div className={"h-screen flex justify-center items-center"}>
        <div className={"h-full flex flex-col"}>
          <div className={"flex-[0.1]"}>
            <ShowUsers user={user}/>
          </div>

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

          <Footer />
        </div>
      </div>
    </>
  );
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>
}

export default LoginPage
