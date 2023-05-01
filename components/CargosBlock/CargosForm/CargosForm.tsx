import React, { ReactElement, RefObject, useEffect, useMemo, useRef } from "react"
import { useForm, Controller } from "react-hook-form"

// mui
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import { FormControl, Grid, MenuItem, Typography } from "@mui/material"
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// project components
import { SubmitButton } from "@/components/ui-component/SubmitButton/SubmitButton"
import { Spaces } from "@/components/CargosBlock/CargosForm/Spaces/Spaces"

// utils
import { GRID_SPACING } from "@/lib/const"
import { fixMeInTheFuture } from "@/lib/types"

// store
import CargosStore, {
  CARGO_FIELD_NAMES,
  STATUS_OPTIONS,
  spaceItemType,
} from "@/stores/cargosStore"

export interface CargoInfoFormControl {
  registerForm: fixMeInTheFuture,
  errorsForm: fixMeInTheFuture,
  setErrorForm: fixMeInTheFuture,
  control: fixMeInTheFuture,
  formDefaultValues: fixMeInTheFuture,
  reset: fixMeInTheFuture,
  getValues: fixMeInTheFuture,
}

export interface CargoInfoFormProps {
  title?: string,
  handleSubmit: () => void,
  formControl: CargoInfoFormControl,
  isFull: boolean,
  isContentVisible: boolean,
  isItEditForm: boolean,
  currentTmpSpaces: Array<spaceItemType>
}

export const CargosForm = ({
                                title,
                                handleSubmit,
                                formControl: {
                                  registerForm,
                                  errorsForm,
                                  control,
                                  formDefaultValues,
                                  reset,
                                  getValues,
                                },
                                isFull,
                                isContentVisible,
                                isItEditForm,
                                currentTmpSpaces,
                              }: CargoInfoFormProps) => {
  const lgColValue = isFull ? 4 : 6
  const isCurrentUserManager = !isFull
  const isDisabled = isFull
  const isLoading = useMemo(
    () => CargosStore.cargos.isLoading,
    [CargosStore.cargos.isLoading]
  )

  const ClientCodeField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id={CARGO_FIELD_NAMES.CLIENT_CODE.value}
        placeholder={CARGO_FIELD_NAMES.CLIENT_CODE.label}
        label={CARGO_FIELD_NAMES.CLIENT_CODE.label}
        className={"bg-white rounded"}
        disabled={true}
        {...registerForm("clientCode", {
          required: true,
        })}
      />
      {!!errorsForm.clientCode && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.clientCode?.message}</p>
      )}
    </>
  )

  const CargoIdField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id={CARGO_FIELD_NAMES.CARGO_ID.value}
        placeholder={CARGO_FIELD_NAMES.CARGO_ID.label}
        label={CARGO_FIELD_NAMES.CARGO_ID.label}
        className={"bg-white rounded"}
        disabled={isDisabled}
        {...registerForm("cargoId", {
          required: true,
        })}
      />
      {!!errorsForm.cargoId && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.cargoId?.message}</p>
      )}
    </>
  )

  const StatusField: ReactElement = (
    <>
      <FormControl
        fullWidth
        style={{
          color: '#121926',
          marginTop: '16px',
          marginBottom: '8px'
        }}
        id={CARGO_FIELD_NAMES.STATUS.value}
      >
        <InputLabel htmlFor="trinity-select">
          {CARGO_FIELD_NAMES.STATUS.label}
        </InputLabel>
        <Controller
          name={"status"}
          control={control}
          defaultValue={formDefaultValues?.status}
          render={({ field }) => (
            <Select
              label={CARGO_FIELD_NAMES.STATUS.label}
              fullWidth
              disabled={isDisabled}
              {...field}
            >
              {STATUS_OPTIONS.map((person) => (
                <MenuItem key={person.value} value={person.value}>
                  {person.text}
                </MenuItem>
              ))}
            </Select>
            )}
        />
      </FormControl>
      {!!errorsForm.status && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.status?.message}</p>
      )}
    </>
  )

  const CostOfDeliveryField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id={CARGO_FIELD_NAMES.COST_OF_DELIVERY.value}
        placeholder={CARGO_FIELD_NAMES.COST_OF_DELIVERY.label}
        label={CARGO_FIELD_NAMES.COST_OF_DELIVERY.label}
        className={"bg-white rounded"}
        disabled={isDisabled}
        {...registerForm("costOfDelivery", {
          required: true,
        })}
      />
      {!!errorsForm.costOfDelivery && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.costOfDelivery?.message}</p>
      )}
    </>
  )

  const CargoNameField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id={CARGO_FIELD_NAMES.CARGO_NAME.value}
        placeholder={CARGO_FIELD_NAMES.CARGO_NAME.label}
        label={CARGO_FIELD_NAMES.CARGO_NAME.label}
        className={"bg-white rounded"}
        disabled={isDisabled}
        {...registerForm("cargoName", {
          required: true,
        })}
      />
      {!!errorsForm.cargoName && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.cargoName?.message}</p>
      )}
    </>
  )

  const InsuranceField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id={CARGO_FIELD_NAMES.INSURANCE.value}
        placeholder={CARGO_FIELD_NAMES.INSURANCE.label}
        label={CARGO_FIELD_NAMES.INSURANCE.label}
        className={"bg-white rounded"}
        disabled={isDisabled}
        {...registerForm("insurance", {
          required: true,
        })}
      />
      {!!errorsForm.insurance && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.insurance?.message}</p>
      )}
    </>
  )

  const CostPlaceField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id={CARGO_FIELD_NAMES.COST.value}
        placeholder={CARGO_FIELD_NAMES.COST.label}
        label={CARGO_FIELD_NAMES.COST.label}
        className={"bg-white rounded"}
        disabled={isDisabled}
        {...registerForm("cost", {
          required: true,
        })}
      />
      {!!errorsForm.cost && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.cost?.message}</p>
      )}
    </>
  )

  const TariffField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id={CARGO_FIELD_NAMES.TARIFF.value}
        placeholder={CARGO_FIELD_NAMES.TARIFF.label}
        label={CARGO_FIELD_NAMES.TARIFF.label}
        className={"bg-white rounded"}
        disabled={isDisabled}
        {...registerForm("tariff", {
          required: true,
        })}
      />
      {!!errorsForm.tariff && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.tariff?.message}</p>
      )}
    </>
  )

  const VolumeField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id={CARGO_FIELD_NAMES.VOLUME.value}
        placeholder={CARGO_FIELD_NAMES.VOLUME.label}
        label={CARGO_FIELD_NAMES.VOLUME.label}
        className={"bg-white rounded"}
        disabled={isDisabled}
        {...registerForm("volume", {
          required: true,
        })}
      />
      {!!errorsForm.volume && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.volume?.message}</p>
      )}
    </>
  )

  const WeightField: ReactElement = (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id={CARGO_FIELD_NAMES.WEIGHT.value}
        placeholder={CARGO_FIELD_NAMES.WEIGHT.label}
        label={CARGO_FIELD_NAMES.WEIGHT.label}
        className={"bg-white rounded"}
        disabled={isDisabled}
        {...registerForm("weight", {
          required: true,
        })}
      />
      {!!errorsForm.weight && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.weight?.message}</p>
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
          {title && <Grid item xs={12}>
            <Grid container alignContent="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h4">{title}</Typography>
              </Grid>
              <Grid item></Grid>
            </Grid>
          </Grid>}
          {isContentVisible &&
            <>
              <Grid item xs={12} className={"mb-6"}>
                <Grid container spacing={GRID_SPACING}>
                  <Grid item lg={lgColValue} md={6} sm={6} xs={12}>
                    {CargoIdField}
                  </Grid>
                  <Grid item lg={lgColValue} md={6} sm={6} xs={12}>
                    {ClientCodeField}
                  </Grid>
                  <Grid item lg={lgColValue} md={6} sm={6} xs={12}>
                    {WeightField}
                  </Grid>
                  <Grid item lg={lgColValue} md={6} sm={6} xs={12}>
                    {VolumeField}
                  </Grid>
                  {/* status */}
                  <Grid item lg={lgColValue} md={6} sm={6} xs={12}>
                    {StatusField}
                  </Grid>
                  <Grid item lg={lgColValue} md={6} sm={6} xs={12}>
                    {CargoNameField}
                  </Grid>
                  <Grid item lg={lgColValue} md={6} sm={6} xs={12}>
                    {CostOfDeliveryField}
                  </Grid>

                  <Grid item lg={lgColValue} md={6} sm={6} xs={12}>
                    {InsuranceField}
                  </Grid>
                  <Grid item lg={lgColValue} md={6} sm={6} xs={12}>
                    {CostPlaceField}
                  </Grid>
                  <Grid item lg={lgColValue} md={6} sm={6} xs={12}>
                    {TariffField}
                  </Grid>
                </Grid>
              </Grid>
              <Spaces
                form={{
                  registerForm,
                  control,
                  errorsForm,
                  formDefaultValues,
                  reset,
                  getValues,
                }}
                currentTmpSpaces={currentTmpSpaces}
                isDisabled={isDisabled}
                isItEditForm={isItEditForm}
                isCurrentUserManager={isCurrentUserManager}
              />
            </>
          }
          {isContentVisible && isCurrentUserManager && <Grid item xs={12}>
            <SubmitButton
              text="Сохранить"
              isLoading={isLoading}
            />
          </Grid>}
        </Grid>
      </Box>
    </>
  )
}

export default CargosForm
