import React, { ReactElement, useState, useMemo, useEffect, ChangeEvent } from "react"
import { useFieldArray } from "react-hook-form"
import { v4 as uuidv4 } from 'uuid'
import { observer } from "mobx-react-lite"

// mui
import Button from "@mui/material/Button"
import { Grid, Typography } from "@mui/material"
import TextField from "@mui/material/TextField"

// project components
import { ImageUpload } from "@/components/CargosBlock/CargosForm/Spaces/ImageUpload/ImageUpload"
import ImagesSlider from "@/components/CargosBlock/CargosForm/Spaces/ImagesSlider"

// utils
import { GRID_SPACING } from "@/lib/const"
import { fixMeInTheFuture } from "@/lib/types"

// assets
import CloseIcon from '@mui/icons-material/Close'

// store
import CargosStore, { CARGO_FIELD_NAMES, spaceItemType, UploadImageType } from "@/stores/cargosStore"
import ClientsStore from "@/stores/clientsStore"

export interface SpaceProps {
  isDisabled: boolean,
  currentTmpSpaces: Array<spaceItemType>
  form: {
    registerForm: fixMeInTheFuture
    control: fixMeInTheFuture
    errorsForm: fixMeInTheFuture
    formDefaultValues: fixMeInTheFuture
    reset: fixMeInTheFuture
    getValues: fixMeInTheFuture
  },
  isItEditForm: boolean
  isCurrentUserManager: boolean
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
                                  },
                                  isItEditForm,
                                  isCurrentUserManager,
}: SpaceProps) => {
  const currentCargoStr = JSON.stringify(CargosStore.cargos?.currentItem)
  const currentCargo = useMemo(
    () => {
      const currentItem = JSON.parse(currentCargoStr)
      return currentItem ? {...currentItem} : null
    },
    [currentCargoStr]
  )
  const cargoId = currentCargo?.id

  const clientId = useMemo(
    () => ClientsStore.clients?.currentItem?.id,
    [ClientsStore.clients?.currentItem?.id]
  )

  const notLoadedSpacesSrt = JSON.stringify(CargosStore.cargos.notLoadedSpaces)
  const currentUploadingFiles: Array<UploadImageType> = useMemo(
    () => {
      const filterCallback = (space: spaceItemType) => (
        space.clientId === clientId &&
        (() => isItEditForm ? space.cargoId === currentCargo?.cargoId : true)()
      )
      const reduceCallback = (accumulator: Array<UploadImageType>, space: spaceItemType) => accumulator.concat(space.photos)
      return CargosStore.cargos.notLoadedSpaces.filter(filterCallback).reduce(reduceCallback, [])
    },
    [notLoadedSpacesSrt])

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "spaces", // unique name for your Field Array
  })

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
  }

  const addPhotoHandler = (index: number) => {
    if (!clientId) {
      console.warn('clientId not found')
      return
    }
    const spaceInfoArgs: {
      spaceIndex: number,
      clientId: string,
      cargoId?: string,
      isItEditForm: boolean
    } = {
      spaceIndex: index,
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

  const getPhotoUrls = (space: spaceItemType): Array<string> => {
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
    if (isWeight) updateSpaceArgs.weight = valueNumber
    else if (isPiecesInPlace) updateSpaceArgs.piecesInPlace = valueNumber
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
                  {isCurrentUserManager && <Button
                    onClick={(e) => removeSpaceHandler(index)}
                    className={"min-w-fit"}
                  >
                    <CloseIcon
                      className={"text-brand"}
                    />
                  </Button>}
                </div>
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                {getWeightField(spaceID, index)}
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                {getPiecesInPlaceField(spaceID, index)}
              </Grid>
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
                      addPhotoHandler={addPhotoHandler.call(this, index)}
                      currentUploadingFiles={space.photos.filter((photo) => photo.spaceIndex === index) || []}
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

export default Spaces
