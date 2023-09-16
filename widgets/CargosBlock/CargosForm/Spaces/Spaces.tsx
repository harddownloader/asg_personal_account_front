import { useMemo, ChangeEvent } from "react"
import { useFieldArray } from "react-hook-form"
import { observer } from "mobx-react-lite"
import * as R from 'ramda'
import Decimal from 'decimal.js'
import * as Sentry from "@sentry/nextjs"

// mui
import Button from "@mui/material/Button"
import { Grid, Typography } from "@mui/material"
import TextField from "@mui/material/TextField"

// project components
import { ImageUpload } from "@/widgets/CargosBlock/CargosForm/Spaces/ImageUpload/ImageUpload"
import { ImagesSlider } from "@/widgets/CargosBlock/CargosForm/Spaces/ImagesSlider"
import { CloseSpaceBtn } from "@/widgets/CargosBlock/CargosForm/Spaces/CloseSpaceBtn"
import { Preloader } from "@/shared/ui/Preloader"

// shared
import { GRID_SPACING } from "@/shared/const"
import { TFixMeInTheFuture } from "@/shared/types/types"

// assets
import DataUsageIcon from '@mui/icons-material/DataUsage'

// store
import { CargosStore } from "@/entities/Cargo"
import { CARGO_FIELD_NAMES } from '@/entities/Cargo'
import type {
  TSpaceItemId,
  TSpaceItem,
  TUploadImage,
  TAddPhotoSpaceInfoArgs
} from '@/entities/Cargo'
import { ClientsStore } from "@/entities/User"
import {
  getSpacesOfExistsCargo,
  getSpacesOfUnsavedCargo
} from "@/entities/Cargo/lib/spaces"
import { volumeFieldInputProps } from "../helpers/VolumeFieldInputProps"
import { weightFieldInputProps } from "../helpers/WeightFieldInputProps"
import { piecesInPlaceFieldInputProps } from "../helpers/PiecesInPlaceFieldInputProps"

export interface ISpaceProps {
  isDisabled: boolean,
  currentTmpSpaces: Array<TSpaceItem>
  form: {
    registerForm: TFixMeInTheFuture
    control: TFixMeInTheFuture
    errorsForm: TFixMeInTheFuture
    formDefaultValues: TFixMeInTheFuture
    reset: TFixMeInTheFuture
    getValues: TFixMeInTheFuture
    setValue: TFixMeInTheFuture
  },
  isItEditForm: boolean
  isCurrentUserManager: boolean
  updateCostOfDeliveryValue: () => void
}

const weightField = {
  name: 'weight',
  defaultValue: '0'
}

const piecesInPlaceField = {
  name: 'piecesInPlace',
  defaultValue: '0'
}

export const Spaces = observer(({
                                  currentTmpSpaces,
                                  isDisabled,
                                  form: {
                                     registerForm,
                                     control,
                                     errorsForm,
                                     formDefaultValues,
                                     reset,
                                     getValues,
                                     setValue,
                                  },
                                  isItEditForm,
                                  isCurrentUserManager,
                                  updateCostOfDeliveryValue,
}: ISpaceProps) => {
  const currentCargoStr = JSON.stringify(CargosStore.cargos?.currentItem)
  const currentCargo = useMemo(
    () => {
      const currentItem = JSON.parse(currentCargoStr)
      return currentItem ? {...currentItem} : null
    },
    [currentCargoStr]
  )
  const cargoId = currentCargo?.id

  const clientId = ClientsStore.clients?.currentItem?.id

  const notLoadedSpacesSrt = JSON.stringify(CargosStore.cargos.notLoadedSpaces.list)
  const areFilesLoading = Boolean(CargosStore.cargos.notLoadedSpaces.numberOfPhotosCurrentlyBeingUploaded)
  const filterCallback = (space: TSpaceItem) => (
    space.clientId === clientId &&
    (() => isItEditForm ? space.cargoId === currentCargo?.cargoId : true)()
  )
  const reduceCallback = (accumulator: Array<TUploadImage>, space: TSpaceItem) => accumulator.concat(space.photos)
  CargosStore.cargos.notLoadedSpaces.list.filter(filterCallback).reduce(reduceCallback, [])

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "spaces", // unique name for your Field Array
  })

  const getSpacesOfCargo = (notLoadedSpacesSrt: string) => {
    const notLoadedSpaces: TSpaceItem[] = JSON.parse(notLoadedSpacesSrt)

    if (!clientId) {
      console.error(`getSpacesOfCargo: clientId:${clientId} is not valid. We return [] as default value.`)
      Sentry.captureMessage(`getSpacesOfCargo: clientId:${clientId} is not valid. We return [] as default value.`)
      return []
    }

    const spacesOfCargoTmp = isItEditForm
      ? getSpacesOfExistsCargo({ spaces: notLoadedSpaces, cargoId, clientId })
      : getSpacesOfUnsavedCargo({ spaces: notLoadedSpaces, clientId })

    return spacesOfCargoTmp
  }

  const calculateValueOfTotalField = ({
                                        spacesOfCargoTmp,
                                        totalFieldName,
                                        spacePropName,
                                        updatedSpaceRightNow=null,
  }: {
    spacesOfCargoTmp: TSpaceItem[]
    totalFieldName: 'volume' | 'weight'
    spacePropName: 'piecesInPlace' | 'weight'
    updatedSpaceRightNow?: {
      spaceID: string
      currentFieldValue: number
    } | null
  }) => {
    // @ts-ignore
    const volumeSum = spacesOfCargoTmp.reduce((acc: number, space) => {
      if (updatedSpaceRightNow && space.id === updatedSpaceRightNow.spaceID) return new Decimal(acc).plus(updatedSpaceRightNow.currentFieldValue)
      return new Decimal(acc).plus(Number(space[`${spacePropName}`])) // acc + Number(space.piecesInPlace)
    }, 0)
    setValue(totalFieldName, volumeSum)
  }

  const updateTotalFields = (spacesOfCargoTmp: TSpaceItem[]) => {
    calculateValueOfTotalField({
      spacesOfCargoTmp,
      totalFieldName: 'weight',
      spacePropName: 'weight'
    })

    calculateValueOfTotalField({
      spacesOfCargoTmp,
      totalFieldName: 'volume',
      spacePropName: 'piecesInPlace'
    })
  }

  const recalculateTotalFields = R.pipe(
    getSpacesOfCargo,
    updateTotalFields,
    updateCostOfDeliveryValue,
  )

  const addSpaceHandler = () => {
    if (!clientId) {
      console.warn('clientId not found')
      return
    }
    const addSpaceArgs: {
      clientId: string,
      cargoId?: string
    } = {
      clientId: clientId
    }
    if (isItEditForm) {
      if (!currentCargo?.cargoId) {
        console.warn('cargoId not found')
        return
      }
      addSpaceArgs.cargoId = currentCargo.id
    }
    CargosStore.addSpace(addSpaceArgs)

    append({
      [`${weightField.name}`]: weightField.defaultValue,
      [`${piecesInPlaceField.name}`]: weightField.defaultValue,
    })

    recalculateTotalFields(JSON.stringify(CargosStore.cargos.notLoadedSpaces.list))
  }

  const removeSpaceHandler = (index: number) => {
    if (!clientId) {
      console.warn('clientId not found')
      return
    }
    const removeSpaceArgs: {
      clientId: string,
      cargoId?: string,
      index: number,
      isItEditForm: boolean
    } = {
      clientId, index, isItEditForm
    }
    if (isItEditForm) {
      if (!currentCargo?.id) {
        console.warn('currentCargo.id not found')
        return
      }
      removeSpaceArgs.cargoId = currentCargo.id
    }
    remove(index)
    CargosStore.removeSpace(removeSpaceArgs)

    recalculateTotalFields(JSON.stringify(CargosStore.cargos.notLoadedSpaces.list))
  }

  const addPhotoHandler = (index: number, spaceID: TSpaceItemId) => {
    if (!clientId) {
      console.warn('clientId not found')
      return
    }
    const spaceInfoArgs: TAddPhotoSpaceInfoArgs = {
      spaceIndex: index,
      spaceID,
      clientId,
      isItEditForm,
    }
    if (isItEditForm) {
      if (!currentCargo?.cargoId) {
        console.warn('cargoId not found')
        return
      }
      spaceInfoArgs.cargoId = currentCargo.id
    }
    return CargosStore.addPhoto.bind(this, spaceInfoArgs)
  }

  const removePhotoHandler = (index: number) => {
    if (!clientId) {
      console.warn('clientId not found')
      return
    }
    const spaceInfoArgs: {
      spaceIndex: number,
      clientId: string,
      cargoId?: string,
      isItEditForm: boolean,
    } = {
      spaceIndex: index,
      clientId,
      isItEditForm,
    }
    if (isItEditForm) {
      if (!currentCargo?.id) {
        console.warn('cargoId not found')
        return
      }
      spaceInfoArgs.cargoId = currentCargo.id
    }
    return CargosStore.removePhoto.bind(this, spaceInfoArgs)
  }

  const getPhotoUrls = (space: TSpaceItem): Array<string> => {
    const loadedPhotos: Array<string> = []
    space.photos.forEach((photo) => {
      if (photo.url !== null) loadedPhotos.push(photo.url)
    })

    return loadedPhotos
  }

  const onChangeProxy = ({
                           e,
                           onChangeCallback,
                           spaceID,
                           isWeight,
                           isPiecesInPlace
  }: {
    e: ChangeEvent<HTMLInputElement>
    onChangeCallback: Function
    spaceID: string
    isWeight?: boolean
    isPiecesInPlace?: boolean
  }) => {
    const value = e?.target?.value
    const valueNumber = Number(value)
    if (
      !value || isNaN(valueNumber)
    ) {
      console.warn('onChangeProxy e.target.value or it\'s is NaN')
      return
    }
    if (

      (!isWeight && !isPiecesInPlace)
    ) {
      console.warn('onChangeProxy not found args')
      return
    }

    const updateSpaceArgs: {
      id: string
      weight?: number | undefined
      piecesInPlace?: number | undefined
    } = {
      id: spaceID
    }

    const spacesOfCargoTmp = getSpacesOfCargo(notLoadedSpacesSrt)
    if (isWeight) {
      updateSpaceArgs.weight = valueNumber
      calculateValueOfTotalField({
        spacesOfCargoTmp,
        totalFieldName: 'weight',
        spacePropName: 'weight',
        updatedSpaceRightNow: {
          spaceID,
          currentFieldValue: valueNumber,
        },
      })
      updateCostOfDeliveryValue()
    }
    else if (isPiecesInPlace) {
      updateSpaceArgs.piecesInPlace = valueNumber

      calculateValueOfTotalField({
        spacesOfCargoTmp,
        totalFieldName: 'volume',
        spacePropName: 'piecesInPlace',
        updatedSpaceRightNow: {
          spaceID,
          currentFieldValue: valueNumber,
        },
      })
    }
    CargosStore.updateSpace(updateSpaceArgs)

    onChangeCallback(e)
  }

  const getWeightField = (spaceID: string, index: number) => {
    const { onChange, onBlur, name, ref } = registerForm(`spaces.${index}.${weightField.name}` as const, {
      required: true,
    })

    return (
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
          type="number"
          inputProps={weightFieldInputProps}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeProxy({
            e,
            spaceID,
            onChangeCallback: onChange,
            isWeight: true
          })}
          onBlur={onBlur}
          name={name}
          ref={ref}
        />
        {!!errorsForm.weight && (
          <p className="text-sm text-red-500 pt-2">{errorsForm.weight?.message}</p>
        )}
      </>
    )
  }

  // const getVolume = (spaceID: string, index: number) => {
  //   const { onChange, onBlur, name, ref } = registerForm(`spaces.${index}.${piecesInPlaceField.name}` as const, {
  //     required: true,
  //   })
  //
  //   return (
  //     <>
  //       <TextField
  //         margin="normal"
  //         required
  //         fullWidth
  //         id={CARGO_FIELD_NAMES.VOLUME.value}
  //         placeholder={CARGO_FIELD_NAMES.VOLUME.label}
  //         label={CARGO_FIELD_NAMES.VOLUME.label}
  //         className={"bg-white rounded"}
  //         disabled={isDisabled}
  //         type="number"
  //         inputProps={volumeFieldInputProps}
  //         onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeProxy({
  //           e,
  //           spaceID,
  //           onChangeCallback: onChange,
  //           isPiecesInPlace: true
  //         })}
  //         onBlur={onBlur}
  //         name={name}
  //         ref={ref}
  //       />
  //       {!!errorsForm.volume && (
  //         <p className="text-sm text-red-500 pt-2">{errorsForm.volume?.message}</p>
  //       )}
  //     </>
  //   )
  // }

  const getPiecesInPlaceField = (spaceID: string, index: number) => {
    const { onChange, onBlur, name, ref } = registerForm(`spaces.${index}.${piecesInPlaceField.name}` as const, {
      required: true,
    })

    return (
      <>
        <TextField
          margin="normal"
          required
          fullWidth
          id={CARGO_FIELD_NAMES.PIECES_IN_PLACE.value}
          placeholder={CARGO_FIELD_NAMES.PIECES_IN_PLACE.label}
          label={CARGO_FIELD_NAMES.PIECES_IN_PLACE.label}
          className={"bg-white rounded"}
          disabled={isDisabled}
          type="number"
          inputProps={piecesInPlaceFieldInputProps}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeProxy({
            e,
            spaceID,
            onChangeCallback: onChange,
            isPiecesInPlace: true
          })}
          onBlur={onBlur}
          name={name}
          ref={ref}
        />
        {!!errorsForm.piecesInPlace && (
          <p className="text-sm text-red-500 pt-2">{errorsForm.piecesInPlace?.message}</p>
        )}
      </>
    )
  }

  // const getSpaceCargoName = () => {
  //   const CargoNameField = (
  //     <>
  //       <TextField
  //         margin="normal"
  //         required
  //         fullWidth
  //         id={CARGO_FIELD_NAMES.CARGO_NAME.value}
  //         placeholder={CARGO_FIELD_NAMES.CARGO_NAME.label}
  //         label={CARGO_FIELD_NAMES.CARGO_NAME.label}
  //         className={"bg-white rounded"}
  //         disabled={isDisabled}
  //         {...registerForm("cargoName", {
  //           required: true,
  //         })}
  //       />
  //       {!!errorsForm.cargoName && (
  //         <p className="text-sm text-red-500 pt-2">{errorsForm.cargoName?.message}</p>
  //       )}
  //     </>
  //   )
  //
  //   return CargoNameField
  // }

  const getCurrentUploadingFiles = (photos: TUploadImage[], index: number) => {
    return photos.filter((photo) => photo.spaceIndex === index)
  }

  return (
    <>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Typography variant="h4">Места: {currentTmpSpaces?.length}</Typography>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        {currentTmpSpaces.map((space, index) => {
          const spaceID = space.id

          return (
            <Grid
              container
              spacing={GRID_SPACING}
              key={spaceID}
              className={"mb-8"}
            >
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <div className={"flex justify-between items-center border border-solid border-brand p-2 text-center w-full"}>
                  <span className={"font-semibold px-2 py-1"}>Место {index+1}</span>
                  {areFilesLoading ? <Preloader IconComponent={DataUsageIcon} /> : <CloseSpaceBtn
                    isCurrentUserManager={isCurrentUserManager}
                    onClickHandler={() => removeSpaceHandler(index)}
                  />}
                </div>
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                {getWeightField(spaceID, index)}
              </Grid>
              {/*<Grid item lg={6} md={6} sm={6} xs={12}>*/}
              {/*  {getVolume(spaceID, index)}*/}
              {/*</Grid>*/}
              <Grid item lg={6} md={6} sm={6} xs={12}>
                {getPiecesInPlaceField(spaceID, index)}
              </Grid>
              {/*<Grid item lg={6} md={6} sm={6} xs={12}>*/}
              {/*  {getSpaceCargoName(*/}
              {/*    // spaceID, index*/}
              {/*  )}*/}
              {/*</Grid>*/}
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <ImagesSlider
                  handlerDelete={removePhotoHandler.call(this, index)}
                  urls={getPhotoUrls(space)}
                  isCurrentUserManager={isCurrentUserManager}
                />
              </Grid>
              {isCurrentUserManager &&
                <>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <ImageUpload
                      addPhotoHandler={addPhotoHandler.call(this, index, spaceID)}
                      currentUploadingFiles={getCurrentUploadingFiles(space.photos, index)}
                    />
                  </Grid>
                </>
              }
            </Grid>
          )
        })}
      </Grid>

      {isCurrentUserManager &&
        <>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Button
              className={"w-full bg-white border-solid border border-brand text-brand font-bold rounded h-14 mt-4 hover:text-white hover:bg-brand"}
              onClick={(e) => addSpaceHandler()}
            >
              + Место
            </Button>
          </Grid>
        </>
      }
    </>
  )
})
