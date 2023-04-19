import React, {
  ReactElement,
  useEffect,
} from "react"
import {
  InferGetServerSidePropsType,
  GetServerSidePropsContext
} from "next"
import nookies from "nookies"
import { useForm } from "react-hook-form"

// mui
import { Grid } from "@mui/material"
import Box from "@mui/material/Box"

// project components
import { AccountLayout } from '@/components/Layout'
import { SubmitButton } from "@/components/ui-component/SubmitButton/SubmitButton"
import { PasswordField } from '@/components/ui-component/fields/PasswordField'

// utils
import { GRID_SPACING } from "@/lib/const"
import { firebaseAdmin } from "@/lib/firebase/firebaseAdmin"
import { getUserFromDB } from "@/lib/ssr/requests/getUsers"

// store
import UserStore, {
  UserOfDB,
  USERS_DB_COLLECTION_NAME,
  UserSavingResponse
} from "@/stores/userStore"
import { ProfileSecurityFields } from "@/stores/userStore/types/profile/security"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    // if the user is authenticated
    const cookies = nookies.get(ctx)
    // console.log(JSON.stringify(cookies, null, 2))
    const currentFirebaseUser = await firebaseAdmin.auth().verifyIdToken(cookies.token)
    const db = firebaseAdmin.firestore()
    const usersRef = await db.collection(USERS_DB_COLLECTION_NAME)
    const currentUserInDB: UserOfDB = await getUserFromDB({
      currentUserId: currentFirebaseUser.uid,
      usersRef
    })

    return {
      props: {
        currentUser: {
          id: currentUserInDB.id,
          name: currentUserInDB.name,
          phone: currentUserInDB.phone,
          email: currentUserInDB.email,
          city: currentUserInDB.city,
          role: currentUserInDB.role,
          userCodeId: currentUserInDB.userCodeId,
        },
      },
    }
  } catch (err) {
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    console.error(`Profile security page error: ${err}`)

    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      // `as never` is required for correct type inference
      // by InferGetServerSidePropsType below
      props: {} as never,
    }
  }
}

function ProfileSecurityPage({
                   currentUser,
                 }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isLoading = UserStore.user.isLoading

  useEffect(() => {
    if(!UserStore.user.currentUser.id) UserStore.saveUserToStore({
      id: currentUser.id,
      name: currentUser.name,
      phone: currentUser.phone,
      email: currentUser.email,
      city: currentUser.city,
      role: currentUser.role,
      userCodeId: currentUser.userCodeId,
    })
  })

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<ProfileSecurityFields & {server: {
    firebase: string
    }}>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    }
  })

  const handleSubmit = handleSubmitForm(async (formData: ProfileSecurityFields):Promise<void> => {
    const { data }: UserSavingResponse = await UserStore.saveNewPassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      repeatNewPassword: formData.repeatNewPassword,
    })

    if (data?.accountSaving?.errors.length) {
      // Unable to sign in.
      data?.accountSaving?.errors.forEach((e) => {
        switch (e.field) {
          case "currentPassword": {
            setErrorForm("currentPassword", { message: e.message! })
            break;
          }
          case "newPassword" : {
            setErrorForm("newPassword", { message: e.message! })
            break;
          }
          case "repeatNewPassword": {
            setErrorForm("repeatNewPassword", { message: e.message! })
            break;
          }
          case "server.firebase": {
            if (e.message === "auth/requires-recent-login") {
              setErrorForm("server.firebase", { message: "Для этого действия требуется обновить вашу сессию. Пожалуйста перезайдите в аккаунт." })
            } else {
              setErrorForm("server.firebase", { message: e.message! })
            }

            break;
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
            <SubmitButton
              text="Сохранить"
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

ProfileSecurityPage.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>
}

export default ProfileSecurityPage
