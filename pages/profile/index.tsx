// @ts-nocheck
import React, { ReactElement, useEffect } from "react"
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import nookies from "nookies"
import { useForm } from "react-hook-form"

// mui
import { Grid } from "@mui/material"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"

// project components
import { AccountLayout } from '@/components/Layout'

// utils
import { fixMeInTheFuture } from "@/lib/types"
import { GRID_SPACING } from "@/lib/const"
import { firebaseAdmin } from "@/lib/firebase/firebaseAdmin"
import {
  firebaseAuth,
  firebaseFirestore,
} from "@/lib/firebase"
import { getUserFromDB } from "@/lib/ssr/requests/getUsers"

// store
import UserStore, {
  UserDataForSaving,
  UserOfDB,
  USERS_DB_COLLECTION_NAME,
  UserSavingResponse
} from "@/stores/userStore"

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

function Profile({
                   currentUser,
                 }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useEffect(() => {
    if(!UserStore.user.id) UserStore.saveUserToStore({
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
  } = useForm<UserDataForSaving>({
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    }
  })

  const handleSubmit = handleSubmitForm(async (formData: UserDataForSaving):Promise<void> => {
    const { data }: UserSavingResponse = await UserStore.save({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      repeatNewPassword: formData.repeatNewPassword,
    })

    if (data?.accountSaving?.errors.length) {
      // Unable to sign in.
      data?.accountSaving?.errors.forEach((e) => {
        if (e.field === "name") {
          setErrorForm("name", { message: e.message! })
        } else if (e.field === "phone") {
          setErrorForm("phone", { message: e.message! })
        } else if (e.field === "email") {
          setErrorForm("email", { message: e.message! })
        } else if (e.field === "currentPassword") {
          setErrorForm("currentPassword", { message: e.message! })
        } else if (e.field === "password") {
          setErrorForm("newPassword", { message: e.message! })
        } else if (e.field === 'repeatPassword') {
          setErrorForm("repeatNewPassword", { message: e.message! })
        } else {
          console.error("Registration error:", e)
        }
      })

      return
    }

    return
  })

  const NameField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Имя"
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
        label="Телефон"
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
        label="Email"
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

  const CurrentPasswordField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        placeholder="Введите ваш текущий пароль"
        type="password"
        id="currentPassword"
        label="Текущий пароль"
        autoComplete="current-password"
        className={"bg-white rounded"}
        {...registerForm("currentPassword",{
          required: true,
        })}
      />
      {!!errorsForm.currentPassword && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.currentPassword?.message}</p>
      )}
    </>
  )

  const NewPasswordField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        placeholder="Введите ваш новый пароль"
        type="password"
        id="newPassword"
        label="Новый пароль"
        autoComplete="current-password"
        className={"bg-white rounded"}
        {...registerForm("newPassword",{
          required: true,
        })}
      />
      {!!errorsForm.newPassword && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.newPassword?.message}</p>
      )}
    </>
  )

  const RepeatNewPasswordField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        placeholder="Повторите ваш новый пароль"
        label="Повторите ваш новый пароль"
        type="password"
        id="repeatNewPassword"
        autoComplete="current-password"
        className={"bg-white rounded"}
        {...registerForm("repeatNewPassword", {
          required: true,
        })}
      />
      {!!errorsForm.repeatNewPassword && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.repeatNewPassword?.message}</p>
      )}
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
                {NameField}
              </Grid>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                {PhoneField}
              </Grid>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                {LoginField}
              </Grid>
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
            <Button
              type="submit"
              fullWidth
              className={"bg-brand border-solid border border-white text-white font-bold rounded h-14 mt-4 hover:text-brand hover:bg-white hover:border-brand"}
            >
              Сохранить
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>
}

export default Profile
