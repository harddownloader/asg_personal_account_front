import React, {
  ReactElement,
  useEffect,
  useMemo
} from "react"
import {
  InferGetServerSidePropsType,
  GetServerSidePropsContext
} from "next"
import nookies from "nookies"
import { useForm } from "react-hook-form"

// mui
import { Grid } from "@mui/material"
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"

// project components
import { AccountLayout } from '@/components/Layout'
import { SubmitButton } from "@/components/ui-component/SubmitButton/SubmitButton"

// utils
import { GRID_SPACING } from "@/lib/const"
import { firebaseAdmin } from "@/lib/firebase/firebaseAdmin"
import { getUserFromDB } from "@/lib/ssr/requests/getUsers"

// store
import UserStore, {
  ProfileContacts,
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
    console.error(`Profile contacts info page error: ${err}`)

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

function ProfileContactsPage({
                   currentUser,
                 }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isLoading = useMemo(() => UserStore.user.isLoading, [UserStore.user.isLoading])

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
  } = useForm<ProfileContacts>({
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      city: currentUser.city,
    }
  })

  const handleSubmit = handleSubmitForm(async (formData: ProfileContacts): Promise<void> => {
    const { data }: UserSavingResponse = await UserStore.saveContactUserData({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      id: currentUser.id,
      userCodeId: currentUser.userCodeId,
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
        } else if (e.field === "city") {
          setErrorForm("city", { message: e.message! })
        } else {
          console.error("Change profile data error:", e)
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

  const CityField: ReactElement = (
    <>
      <TextField
        margin="normal"
        fullWidth
        id="city"
        label="Город"
        placeholder="Ваш город"
        autoComplete="email"
        className={"bg-white rounded"}
        {...registerForm("city", {
          required: false,
        })}
      />
      {!!errorsForm.city && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.city?.message}</p>
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
          {/*<Grid item xs={4}>*/}
          {/*  <Grid container spacing={GRID_SPACING}>*/}
          {/*    <Grid item lg={12} md={12} sm={12} xs={12}>*/}
          {/*      <Avatar*/}
          {/*        alt="Remy Sharp"*/}
          {/*        // src="/static/images/avatar/1.jpg"*/}
          {/*        variant="rounded"*/}
          {/*        sx={{ width: '100%', maxWidth: '250px', height: '100%' }}*/}
          {/*      />*/}
          {/*    </Grid>*/}
          {/*  </Grid>*/}
          {/*</Grid>*/}
          <Grid item xs={12}>
            <Grid container spacing={GRID_SPACING}>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                {NameField}
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                {PhoneField}
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                {LoginField}
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                {CityField}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={GRID_SPACING}>
          <Grid item xs={12}>
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

ProfileContactsPage.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>
}

export default ProfileContactsPage
