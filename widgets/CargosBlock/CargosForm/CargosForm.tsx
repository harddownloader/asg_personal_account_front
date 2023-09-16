import { ChangeEvent, ReactElement, useMemo } from "react"
import { Controller } from "react-hook-form"

// mui
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import {
  FormControl,
  Grid, MenuItem,
  Typography
} from "@mui/material"
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'

// project components
import { SaveCargoButton } from "./SaveCargoButton"
import { Spaces } from "@/widgets/CargosBlock/CargosForm/Spaces/Spaces"
import { Title } from "@/widgets/CargosBlock/CargosForm/Title"

// shared
import { GRID_SPACING } from "@/shared/const"
import { TFixMeInTheFuture } from "@/shared/types/types"

// entities
import { CargosStore } from "@/entities/Cargo"
import {
  CARGO_FIELD_NAMES,
  STATUS_OPTIONS,
} from '@/entities/Cargo'
import type { TSpaceItem } from '@/entities/Cargo'

// types
import { TTitle } from "@/widgets/CargosBlock/CargosInfo/CargoInfo"
import { volumeFieldInputProps } from "@/widgets/CargosBlock/CargosForm/helpers/VolumeFieldInputProps"
import { weightFieldInputProps } from "./helpers/WeightFieldInputProps"

export interface CargoInfoFormControl {
  registerForm: TFixMeInTheFuture,
  errorsForm: TFixMeInTheFuture,
  setErrorForm: TFixMeInTheFuture,
  control: TFixMeInTheFuture,
  formDefaultValues: TFixMeInTheFuture,
  reset: TFixMeInTheFuture,
  getValues: TFixMeInTheFuture,
  setValue: TFixMeInTheFuture
}

export interface CargoInfoFormProps {
  title?: TTitle,
  handleSubmit: () => void,
  formControl: CargoInfoFormControl,
  isFull: boolean,
  isContentVisible: boolean,
  isItEditForm: boolean,
  currentTmpSpaces: Array<TSpaceItem>
}

const weightRegName = 'weight' as const
const tariffRegName = 'tariff' as const
const costOfDeliveryRegName = 'costOfDelivery' as const

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
                                  setValue,
                                },
                                isFull,
                                isContentVisible,
                                isItEditForm,
                                currentTmpSpaces,
                              }: CargoInfoFormProps) => {
  const lgColValue = isFull ? 4 : 6
  const isCurrentUserManager = !isFull
  const isDisabled = isFull

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
        disabled={true}
        type="number"
        inputProps={{ min: 0, max: 100000000, step: 1 }}
        defaultValue={formDefaultValues?.costOfDelivery}
        {...registerForm(costOfDeliveryRegName, {
          valueAsNumber: true,
          required: true,
        })}
      />
      {!!errorsForm.costOfDelivery && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.costOfDelivery?.message}</p>
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
        type="number"
        inputProps={{ min: "0.00", max: "100000000.00", step: "0.01" }}
        {...registerForm("insurance", {
          valueAsNumber: true,
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
        type="number"
        inputProps={{ min: "0.00", max: "100000000.00", step: "0.01" }}
        {...registerForm("cost", {
          valueAsNumber: true,
          required: true,
        })}
      />
      {!!errorsForm.cost && (
        <p className="text-sm text-red-500 pt-2">{errorsForm.cost?.message}</p>
      )}
    </>
  )

  const updateCostOfDeliveryValue = () => {
    const tariffValue = getValues(tariffRegName)
    const weightValue = getValues(weightRegName)
    setValue(costOfDeliveryRegName, Math.ceil(tariffValue * weightValue))
  }

  const getTariffField = () => {

    const { onChange, onBlur, name, ref } = registerForm(tariffRegName, {
      required: true,
    })

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
          type="number"
          inputProps={{ min: "0.0", max: "100000000.0", step: "0.1" }}
          {...registerForm(tariffRegName, {
            valueAsNumber: true,
            required: true,
          })}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChange(e)

            updateCostOfDeliveryValue()
          }}
          onBlur={onBlur}
          name={name}
          ref={ref}
        />
        {!!errorsForm.tariff && (
          <p className="text-sm text-red-500 pt-2">{errorsForm.tariff?.message}</p>
        )}
      </>
    )

    return TariffField
  }

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
        disabled={true}
        type="number"
        inputProps={volumeFieldInputProps}
        defaultValue={formDefaultValues?.volume}
        {...registerForm("volume", {
          valueAsNumber: true,
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
        disabled={true}
        type="number"
        inputProps={weightFieldInputProps}
        defaultValue={formDefaultValues?.weight}
        {...registerForm(weightRegName, {
          valueAsNumber: true,
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
          <Title title={title || ""} />
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
                    {CostOfDeliveryField}
                  </Grid>

                  <Grid item lg={lgColValue} md={6} sm={6} xs={12}>
                    {InsuranceField}
                  </Grid>
                  <Grid item lg={lgColValue} md={6} sm={6} xs={12}>
                    {CostPlaceField}
                  </Grid>
                  <Grid item lg={lgColValue} md={6} sm={6} xs={12}>
                    {getTariffField()}
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
                  setValue,
                }}
                currentTmpSpaces={currentTmpSpaces}
                isDisabled={isDisabled}
                isItEditForm={isItEditForm}
                isCurrentUserManager={isCurrentUserManager}
                updateCostOfDeliveryValue={updateCostOfDeliveryValue}
              />
            </>
          }
          {isContentVisible && isCurrentUserManager && <Grid item xs={12}>
            <SaveCargoButton />
          </Grid>}
        </Grid>
      </Box>
    </>
  )
}
