import React, { Fragment, ReactElement, useEffect, useMemo } from 'react'
import { useForm } from "react-hook-form"
import { observer } from "mobx-react-lite"

// mui
import Grid from '@mui/material/Grid'
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"

// project components
import { CargosForm } from "@/components/CargosBlock/CargosForm"
import { DialogHOC } from '@/components/Dialog/Modal/DialogHOC'

// store
import CargosStore, {
  CargoInterfaceForForm,
  CargoInterfaceFull,
  CargoAddResponse, spaceItemType,
} from "@/stores/cargosStore"
import { UserCodeIdType, UserIdType } from "@/stores/userStore"
import {prepareSpaces} from "@/components/CargosBlock/helpers/prepareBody"
import {getSpacesOfUnsavedCargo} from "@/stores/helpers/spaces";

export interface AddCargoDialogProps {
  isVisible: boolean
  handleCancel: () => void
  clientCode: UserCodeIdType
  clientId: UserIdType | null
}

export const AddCargoDialog = observer(({
                                 isVisible,
                                 handleCancel,
                                 clientCode,
                                 clientId,
}: AddCargoDialogProps) => {
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
    reset,
    control,
    getValues,
  } = useForm<CargoInterfaceFull>({})

  useEffect(() => {
    if (clientCode) reset({ clientCode: clientCode })
  }, [clientCode])

  const getCurrentNewTmpSpaces = (notLoadedSpaces: Array<spaceItemType>) => {
    if (!clientId) {
      console.warn('getCurrentNewTmpSpaces: Not found clientId', { clientId })
      return []
    }

    const currentSpacesTmp = getSpacesOfUnsavedCargo(notLoadedSpaces, clientId)

    console.log('AddCargoDialog getCurrentNewTmpSpaces', {
      currentSpacesTmp,
      notLoadedSpaces
    })

    return currentSpacesTmp
  }

  const notLoadedSpacesSrt = JSON.stringify(CargosStore.cargos.notLoadedSpaces)
  const currentTmpSpaces = useMemo(
    () => getCurrentNewTmpSpaces(JSON.parse(notLoadedSpacesSrt)), [notLoadedSpacesSrt]
  )
  console.log('AddCargoDialog', {
    currentTmpSpaces,
    allSpaces: JSON.parse(notLoadedSpacesSrt),
  })

  const handleAddCargo = handleSubmitForm(async ({
                                                    cargoId,
                                                    clientCode,
                                                    status,
                                                    costOfDelivery,
                                                    cargoName,
                                                    insurance,
                                                    cost,
                                                    shippingDate,
                                                    volume,
                                                    weight,
                                                  }: CargoInterfaceForForm): Promise<void> => {

    // const currentTmpSpaces = getCurrentNewTmpSpaces(JSON.parse(notLoadedSpacesSrt))

    const { data }: CargoAddResponse = await CargosStore.add({
      cargoId,
      clientCode,
      status,
      costOfDelivery,
      cargoName,
      insurance,
      cost,
      shippingDate,
      volume,
      weight,
      spaces: currentTmpSpaces
    })


    if (data?.addingCargo?.errors.length) {
      // Unable to sign in.
      data?.addingCargo?.errors.forEach((e) => {
        if (e.field === "cargoId") {
          setErrorForm("cargoId", { message: e.message! })
        } else if (e.field === "clientCode") {
          setErrorForm("clientCode", { message: e.message! })
        } else if (e.field === 'status') {
          setErrorForm("status", { message: e.message! })
        } else if (e.field === 'costOfDelivery') {
          setErrorForm("costOfDelivery", { message: e.message! })
        } else if (e.field === 'cargoName') {
          setErrorForm("cargoName", { message: e.message! })
        } else if (e.field === 'insurance') {
          setErrorForm("insurance", { message: e.message! })
        } else if (e.field === 'cost') {
          setErrorForm("cost", { message: e.message! })
        } else if (e.field === 'shippingDate') {
          setErrorForm("shippingDate", { message: e.message! })
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

    handleCancel && handleCancel()
    CargosStore.clearNotLoadedSpaces()

    return
  })

  const closeHandler = () => {
    clearSpacesForAddCargo()
    handleCancel()
  }

  const clearSpacesForAddCargo = () => {
    if (clientId === null) {
      console.warn('getCurrentNewTmpSpaces: Not found clientId', { clientId })
      return
    }
    const tmpSpaces = JSON.parse(notLoadedSpacesSrt)
    const onlyExistsSpaces = tmpSpaces.filter((space: spaceItemType): boolean => {
      return (
        space.clientId === clientId &&
        space?.cargoId !== undefined
      )
    })
    CargosStore.initNotLoadedSpaces(onlyExistsSpaces)
  }

  return (
    <DialogHOC
      isVisible={isVisible}
      isMobileVersion={false}
      title={'Добавить груз'}
      handleClose={closeHandler}
      confirm={null}
      childrenFooter={
        <></>
      }
      maxWidth={'sm'}
    >
      <CargosForm
        isFull={false}
        isContentVisible={true}
        handleSubmit={handleAddCargo}
        formControl={{
          registerForm,
          errorsForm,
          setErrorForm,
          control,
          formDefaultValues: {
            status: 0
          },
          reset,
          getValues,
        }}
        currentTmpSpaces={currentTmpSpaces}
        isItEditForm={false}
      />
    </DialogHOC>
  )
})

export default AddCargoDialog
