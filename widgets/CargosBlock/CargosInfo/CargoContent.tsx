import {
  useEffect,
  useState,
  useMemo
} from 'react'
import { useForm } from "react-hook-form"
import { observer } from "mobx-react-lite"

// project components
import { CargosForm } from '@/widgets/CargosBlock/CargosForm'

// shared
import { prepareSpaces } from '@/widgets/CargosBlock/helpers/prepareBody'

// store
import { CargosStore } from "@/entities/Cargo"
import type {
  ICargoForForm,
  ICargoFull,
  ICargoSavingResponse,
  TSpaceItem,
  TUploadImage,
} from '@/entities/Cargo'
import { getSpacesOfExistsCargo } from '@/entities/Cargo/lib/spaces'
import type { IUserOfDB } from "@/entities/User"
import { mapCargoSpacesDataFromApi } from '@/entities/Cargo'
import type { TTitle, TIsFull } from "@/widgets/CargosBlock/CargosInfo/CargoInfo"
import { ICargoSubmitForm } from '@/entities/Cargo/types'

export interface ICargoContentProps {
  title: TTitle
  isFull: TIsFull
  currentClient: IUserOfDB
  currentCargo: ICargoFull
}

/*
* Edit cargo data component
* */
export const CargoContent = observer(function CargoContent({
                               isFull,
                               title,
                               currentCargo,
                               currentClient,
                             }: ICargoContentProps) {
  // load spaces tmp storage
  const notLoadedSpacesSrt = JSON.stringify([...CargosStore.cargos.notLoadedSpaces.list])

  // mount && unmount
  useEffect(() => {
    if (currentClient?.id && currentCargo?.id) {
      initTmpSpaces()
    }

    return () => {
      CargosStore.clearNotLoadedSpaces()
    }
  }, [])

  // switch to another cargo
  useEffect(() => {
    if (currentCargo?.id) {
      switchToAnotherCargo()
    }
  }, [currentCargo.id])

  const switchToAnotherCargo = async () => {
    await CargosStore.clearNotLoadedSpaces()
    await resetCargoForm()
  }

  const initTmpSpaces = () => {
    const currentSpacesTmp: Array<TSpaceItem> = getCurrentTmpSpaces(JSON.parse(notLoadedSpacesSrt))

    if (!currentSpacesTmp.length && currentCargo && JSON.parse(JSON.stringify(currentCargo.spaces))?.length) {
      // init tmp spaces for current cargo
      const newTmpSpaceItems: Array<TSpaceItem> = mapCargoSpacesDataFromApi({
        spaces: currentCargo.spaces,
        clientId: currentClient.id,
        cargoId: currentCargo.id
      })
      CargosStore.initNotLoadedSpaces(newTmpSpaceItems)

      return newTmpSpaceItems
    } else {
      return null
    }
  }

  const getCurrentTmpSpaces = (notLoadedSpaces: Array<TSpaceItem>) => {
    return getSpacesOfExistsCargo({
      spaces: notLoadedSpaces,
      cargoId: currentCargo.id,
      clientId: currentClient.id,
    })
  }

  const formDefaultValues = {
    // id: currentCargo.id,
    clientCode: currentCargo.clientCode,
    status: currentCargo.status,
    costOfDelivery: currentCargo.costOfDelivery,
    insurance: currentCargo.insurance,
    cost: currentCargo.cost,
    tariff: currentCargo.tariff,
    volume: currentCargo.volume,
    weight: currentCargo.weight,
    spaces: currentCargo?.spaces,
    toneId: currentCargo?.toneId || "", // "9114f974-6c7a-4c02-83d5-fcc9f7d000e4" ||
  }

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
    clearErrors: clearErrorsForm,
    reset,
    control,
    getValues,
    setValue,
  } = useForm<ICargoFull>({
    defaultValues: formDefaultValues
  })

  const resetCargoForm = () => {
    // for use form
    reset(formDefaultValues)

    if (currentClient?.id && currentCargo?.id) {
      initTmpSpaces()
    }
  }

  const onInvalid = (errors: any) => console.error(errors)
  const handleSaveCargo = async ({
                                                    toneId,
                                                    clientCode,
                                                    status,
                                                    costOfDelivery,
                                                    insurance,
                                                    cost,
                                                    tariff,
                                                    volume,
                                                    weight,
                                                  }: ICargoSubmitForm): Promise<void> => {
    if (!currentCargo?.id) {
      console.warn('currentCargo.id not found')
      return
    }

    const currentTmpSpaces = getCurrentTmpSpaces(JSON.parse(notLoadedSpacesSrt))

    const { data }: ICargoSavingResponse = await CargosStore.update({
      id: currentCargo.id,
      toneId,
      clientCode,
      status,
      costOfDelivery,
      insurance,
      cost,
      tariff,
      volume,
      weight,
      spaces: prepareSpaces(currentTmpSpaces),
      createdAt: new Date(currentCargo.createdAt).toISOString(),
      updatedAt: new Date().toISOString(),
    })

    if (data?.cargoSaving?.errors.length) {
      // Unable to sign in.
      data?.cargoSaving?.errors.forEach((e) => {
        if (e.field === "toneId") {
          setErrorForm("toneId", { message: e.message! })
        } else if (e.field === "clientCode") {
          setErrorForm("clientCode", { message: e.message! })
        } else if (e.field === 'status') {
          setErrorForm("status", { message: e.message! })
        } else if (e.field === 'costOfDelivery') {
          setErrorForm("costOfDelivery", { message: e.message! })
        } else if (e.field === 'insurance') {
          setErrorForm("insurance", { message: e.message! })
        } else if (e.field === 'cost') {
          setErrorForm("cost", { message: e.message! })
        } else if (e.field === 'tariff') {
          setErrorForm("tariff", { message: e.message! })
        } else if (e.field === 'volume') {
          setErrorForm("volume", { message: e.message! })
        } else if (e.field === 'weight') {
          setErrorForm("weight", { message: e.message! })
        } else {
          console.error("Registration error:", e)
        }
      })

      return
    }

    CargosStore.initNotLoadedSpaces(currentTmpSpaces)

    return
  }

  return (
    <>
      <CargosForm
        isFull={isFull}
        isContentVisible={true}
        title={title}
        handleSubmit={handleSubmitForm(handleSaveCargo, onInvalid)}
        formControl={{
          registerForm,
          errorsForm,
          setErrorForm,
          clearErrorsForm,
          control,
          formDefaultValues,
          reset,
          getValues,
          setValue,
        }}
        currentTmpSpaces={getCurrentTmpSpaces(JSON.parse(notLoadedSpacesSrt))}
        isItEditForm={true}
      />
    </>
  )
})
