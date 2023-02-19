import React, {ReactElement, useMemo} from "react"

// mui
import Box from "@mui/material/Box"
import { Grid, Typography } from "@mui/material"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"

// project components
import { SubmitButton } from "@/components/ui-component/SubmitButton/SubmitButton"

// utils
import { GRID_SPACING } from "@/lib/const"
import {fixMeInTheFuture} from "@/lib/types"

// store
import ClientsStore from '@/stores/clientsStore'

export interface EditFormControl {
  registerForm: fixMeInTheFuture,
  errorsForm: fixMeInTheFuture,
  setErrorForm: fixMeInTheFuture,
}

export interface EditFormProps {
  title: string,
  handleSubmit: () => void,
  formControl: EditFormControl,
}

export const EditForm = ({
                           title,
                           handleSubmit,
                           formControl: {
                             registerForm,
                             errorsForm,
                           }
                          }: EditFormProps) => {
  const isLoading = useMemo(() => ClientsStore.clients.isLoading, [ClientsStore.clients.isLoading])

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

  const UserCodeIdField: ReactElement = (
    <>
      <TextField
        margin="normal"
        fullWidth
        id="userCodeId"
        label="Код клиента"
        placeholder="Код клиента"
        autoComplete="email"
        className={"bg-white rounded"}
        {...registerForm("userCodeId", {
          required: false,
        })}
      />
      {!!errorsForm.userCodeId && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.userCodeId?.message}</p>
      )}
    </>
  )

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        <Grid container spacing={GRID_SPACING}>
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
              <Grid item lg={6} md={6} sm={6} xs={12}>
                {UserCodeIdField}
              </Grid>
            </Grid>
          </Grid>
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

export default EditForm
