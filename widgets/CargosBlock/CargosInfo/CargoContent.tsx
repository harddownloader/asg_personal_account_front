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

export interface ICargoContentProps {
  title: TTitle
  isFull: TIsFull
  currentClient: IUserOfDB
  currentCargo: ICargoFull
}

/*
* Edit cargo data component
* */
export const CargoContent = observer(({
                               isFull,
                               title,
                               currentCargo,
                               currentClient,
                             }: ICargoContentProps) => {
  // load spaces tmp storage
  const notLoadedSpacesSrt = JSON.stringify([...CargosStore.cargos.notLoadedSpaces.list])

  useEffect(() => {
    if (currentClient?.id && currentCargo?.id) {
      const currentSpacesTmp = getCurrentTmpSpaces(JSON.parse(notLoadedSpacesSrt))
      initTmpSpaces(currentSpacesTmp)
    }
  }, [])

  useEffect(() => {
    if (currentCargo?.id) {
      resetCargoForm()
    }
  }, [currentCargo?.id])

  const initTmpSpaces = (currentSpacesTmp: Array<TSpaceItem>) => {
    if (!currentSpacesTmp.length && currentCargo?.spaces?.length) {
      // init tmp spaces for current cargo
      const newTmpSpaceItems: Array<TSpaceItem> = mapCargoSpacesDataFromApi({
        spaces: currentCargo.spaces,
        clientId: currentClient.id,
        cargoId: currentCargo.id
      })
      CargosStore.initNotLoadedSpaces(newTmpSpaceItems)

      return newTmpSpaceItems
    } else {
      CargosStore.clearNotLoadedSpaces()
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
    cargoId: currentCargo.cargoId,
    clientCode: currentCargo.clientCode,
    status: currentCargo.status,
    costOfDelivery: currentCargo.costOfDelivery,
    insurance: currentCargo.insurance,
    cost: currentCargo.cost,
    tariff: currentCargo.tariff,
    volume: currentCargo.volume,
    weight: currentCargo.weight,
    spaces: currentCargo?.spaces,
  }

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
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
      const currentSpacesTmp = getCurrentTmpSpaces(JSON.parse(notLoadedSpacesSrt))
      initTmpSpaces(currentSpacesTmp)
    }
  }

  const handleSaveCargo = handleSubmitForm(async ({
                                                    cargoId,
                                                    clientCode,
                                                    status,
                                                    costOfDelivery,
                                                    insurance,
                                                    cost,
                                                    tariff,
                                                    volume,
                                                    weight,
                                                  }: ICargoForForm): Promise<void> => {
    if (!currentCargo?.id) {
      console.warn('currentCargo.id not found')
      return
    }

    const currentTmpSpaces = getCurrentTmpSpaces(JSON.parse(notLoadedSpacesSrt))

    const { data }: ICargoSavingResponse = await CargosStore.update({
      id: currentCargo.id,
      cargoId,
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
        if (e.field === "cargoId") {
          setErrorForm("cargoId", { message: e.message! })
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
  })

  return (
    <>
      <CargosForm
        isFull={isFull}
        isContentVisible={true}
        title={title}
        handleSubmit={handleSaveCargo}
        formControl={{
          registerForm,
          errorsForm,
          setErrorForm,
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
