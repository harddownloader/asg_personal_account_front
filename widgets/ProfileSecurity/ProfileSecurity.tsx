import { ReactElement, useEffect } from "react"
import { useForm } from "react-hook-form"
import * as Sentry from "@sentry/nextjs"

// mui
import { Grid } from "@mui/material"
import Box from "@mui/material/Box"

// project components
import { SubmitButton } from "@/shared/ui/SubmitButton/SubmitButton"
import { PasswordField } from '@/shared/ui/fields/PasswordField'

// shared
import { GRID_SPACING } from "@/shared/const"

// store
import { UserStore } from "@/entities/User"
import type {
  IUserOfDB,
  TUserSavingResponse,
  IProfileSecurityFields,
} from '@/entities/User'
import { FormSubmitButton } from "@/widgets/ProfileSecurity/FormSubmitButton"

export interface ProfileSecurityProps {
  currentUser: IUserOfDB
}

export const ProfileSecurity = ({ currentUser }: ProfileSecurityProps) => {


  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<IProfileSecurityFields & {server: {
      firebase: string
    }}>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    }
  })

  const handleSubmit = handleSubmitForm(async (formData: IProfileSecurityFields):Promise<void> => {
    const { data }: TUserSavingResponse = await UserStore.saveNewPassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      repeatNewPassword: formData.repeatNewPassword,
      id: currentUser.id,
      country: currentUser.country,
    })

    if (data?.accountSaving?.errors.length) {
      // Unable to sign in.
      data?.accountSaving?.errors.forEach((e) => {
        switch (e.field) {
          case "currentPassword": {
            setErrorForm("currentPassword", { message: e.message! })
            break
          }
          case "newPassword" : {
            setErrorForm("newPassword", { message: e.message! })
            break
          }
          case "repeatNewPassword": {
            setErrorForm("repeatNewPassword", { message: e.message! })
            break
          }
          case "server.firebase": {
            if (e.message === "auth/requires-recent-login") {
              setErrorForm("server.firebase", { message: "Для этого действия требуется обновить вашу сессию. Пожалуйста перезайдите в аккаунт." })
            } else {
              setErrorForm("server.firebase", { message: e.message! })
            }

            break
          }
          default: {
            console.error("Change profile security data, Error:", e)
          }
        }
      })

      return
    }

    return
  })

  const CurrentPasswordField: ReactElement = (
    <>
      <PasswordField
        placeholder="Введите ваш текущий пароль"
        id="currentPassword"
        label="Текущий пароль"
        registerFormFunc={registerForm("currentPassword",{
          required: true,
        })}
        errorsFormJSX={<>
          {!!errorsForm.currentPassword && (
            <p className="text-sm text-red-500 pt-2">{errorsForm.currentPassword?.message}</p>
          )}
        </>}
      />
    </>
  )

  const NewPasswordField: ReactElement = (
    <>
      <PasswordField
        placeholder="Введите ваш новый пароль"
        id="newPassword"
        label="Новый пароль"
        registerFormFunc={registerForm( "newPassword",{
          required: true,
        })}
        errorsFormJSX={<>
          {!!errorsForm.newPassword && (
            <p className="text-sm text-red-500 pt-2">{errorsForm.newPassword?.message}</p>
          )}
        </>}
      />
    </>
  )

  const RepeatNewPasswordField: ReactElement = (
    <>
      <PasswordField
        placeholder="Повторите ваш новый пароль"
        id="repeatNewPassword"
        label="Повторите ваш новый пароль"
        registerFormFunc={registerForm( "repeatNewPassword",{
          required: true,
        })}
        errorsFormJSX={<>
          {!!errorsForm.repeatNewPassword && (
            <p className="text-sm text-red-500 pt-2">{errorsForm.repeatNewPassword?.message}</p>
          )}
        </>}
      />
    </>
  )

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        className={"mt-2"}
      >
        <Grid container spacing={GRID_SPACING}>
          <Grid item xs={12}>
            <Grid container spacing={GRID_SPACING}>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                {CurrentPasswordField}
              </Grid>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                {NewPasswordField}
              </Grid>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                {RepeatNewPasswordField}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={GRID_SPACING}>
          <Grid item xs={12}>
            {!!errorsForm?.server?.firebase && <p className="text-sm text-red-500 pt-2">Ошибка сервера. {errorsForm.server.firebase?.message}</p>}
            <FormSubmitButton />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
