import { ReactElement, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as Sentry from "@sentry/nextjs"
import { observer } from "mobx-react-lite"

// mui
import Container from "@mui/material/Container"
import TextField from '@mui/material/TextField'

// project components
import { AuthForm } from '@/widgets/Form'
import { PasswordField as PasswordFieldComponent } from '@/shared/ui/fields/PasswordField'

// shared
import { pagesPath } from "@/shared/lib/$path"
import { useAuthLoaderController } from "@/shared/lib/hooks/useAuthLoaderController"

// store
import { UserStore } from "@/entities/User"

// assets
import classes from './LoginSection.module.scss'


export interface ILoginFormData {
  email: string
  password: string
}

export const LoginSection = observer(() => {
  const router = useRouter()
  useAuthLoaderController()

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
    await router.push(pagesPath.home.$url().pathname)

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
      className={classes.text_field}
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
        className={classes.text_field}
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
})
