import {
  ReactElement,
} from "react"
import { useForm } from "react-hook-form"
import * as Sentry from "@sentry/nextjs"
import { useRouter } from "next/navigation"

// mui
import { Grid } from "@mui/material"
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"

// project components
import { FormSubmitButton } from "./FormSubmitButton"

// shared
import { GRID_SPACING } from "@/shared/const"
import { pagesPath } from "@/shared/lib/$path"

// store
import { UserStore } from "@/entities/User"
import { updateAndSet } from "@/entities/User"
import type {
  IProfileContacts,
  IUserOfDB,
  TUserSavingResponse
} from '@/entities/User'
import { getCookies } from "@/shared/lib/cookies"
import { ACCESS_TOKEN_KEY } from "@/shared/lib/providers/auth"

export interface EditProfileProps {
  currentUser: IUserOfDB
}

export const EditProfile = ({ currentUser }: EditProfileProps) => {
  const router = useRouter()

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
  } = useForm<IProfileContacts>({
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      city: currentUser.city,
    }
  })

  const handleSubmit = handleSubmitForm(async (formData: IProfileContacts): Promise<void> => {
    const { data }: TUserSavingResponse = await UserStore.saveContactUserData({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      id: currentUser.id,
      userCodeId: currentUser.userCodeId,
      country: currentUser.country
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
        } else if (e.field === 'token_expire') {
          router.push(pagesPath.login.$url().pathname)
        } else if (e.field === "server") {
          setErrorForm("name", { message: e.message! })
        } else {
          console.error("Change profile data error:", e)
        }
      })

      return
    }

    const token = await getCookies(ACCESS_TOKEN_KEY)
    if (token) await updateAndSet({ country: currentUser.country, token })
    else console.error('after user update token wasnt found')
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
            <FormSubmitButton />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
