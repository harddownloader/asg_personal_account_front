import React, {ReactElement, useEffect} from "react"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import nookies from "nookies"
import { useForm } from "react-hook-form"

// mui
import Container from "@mui/material/Container"
import TextField from '@mui/material/TextField'

// project components
import { AuthForm } from '@/components/Form'
import { AuthLayout } from "@/components/Layout/AuthLayout/AuthLayout"
import { FooterMemoized } from "@/components/Footer"

// utils
import { firebaseAdmin } from "@/lib/firebase/firebaseAdmin"

// store
import UserStore from "@/stores/userStore"

export interface LoginFormData {
  email: string;
  password: string;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx)
    // console.log(JSON.stringify(cookies, null, 2))
    const currentFirebaseUser = await firebaseAdmin.auth().verifyIdToken(cookies.token)

    return {
      // redirect: {
      //   permanent: false,
      //   destination: "/",
      // },
      // `as never` is required for correct type inference
      // by InferGetServerSidePropsType below
      props: {
        currentFirebaseUser
      } as never,
    }
  } catch (err) {
    return {
      props: {
        error_msg: err
      } as never,
    }
  }
}

export function LoginPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<LoginFormData>({})

  useEffect(() => {
    UserStore.logout()
  })

  const handleLogin = handleSubmitForm(async (formData: LoginFormData):Promise<void> => {
    const { data } = await UserStore.login({
      email: formData.email,
      password: formData.password,
    })

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
            <div></div>
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

          <FooterMemoized />
        </div>
      </div>
    </>
  );
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>
}

export default LoginPage
