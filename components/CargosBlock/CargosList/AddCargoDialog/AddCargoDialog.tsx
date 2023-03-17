import React, { Fragment, ReactElement, useEffect } from 'react'
import { useForm } from "react-hook-form"

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

export interface AddCargoDialogProps {
  isVisible: boolean
  handleCancel: () => void
  clientCode: UserCodeIdType
  clientId: UserIdType | null
}

export const AddCargoDialog = ({
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
      spaces: [],
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

  const notLoadedSpacesSrt = JSON.stringify(CargosStore.cargos.notLoadedSpaces)

  const getCurrentNewTmpSpaces = (notLoadedSpaces: Array<spaceItemType>) => {
    if (!clientId) {
      console.warn('getCurrentNewTmpSpaces: Not found clientId', { clientId })
      return []
    }

    // const filterCallback = (space: spaceItemType): boolean => {
    //   console.log('space?.cargoId', space?.cargoId)
    //   return (
    //     space.clientId === clientId &&
    //     space?.cargoId === undefined
    //   )
    // }

    const currentSpacesTmp = notLoadedSpaces.filter((space: spaceItemType): boolean => {
      return (
        space.clientId === clientId &&
        space?.cargoId === undefined
      )
    })

    // const newCurrentTmpSpaceItems: Array<spaceItemType> = convertSpacesOfDbToStorageFormat({
    //   spaces: currentSpacesTmp,
    //   clientId: currentClient.id,
    //   cargoId: currentCargo.id
    // })

    console.log('getCurrentNewTmpSpaces', {
      currentSpacesTmp,
      notLoadedSpaces
    })
    return currentSpacesTmp
  }

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
        currentTmpSpaces={getCurrentNewTmpSpaces(JSON.parse(notLoadedSpacesSrt))}
        isItEditForm={false}
      />
    </DialogHOC>
  )
}

export default AddCargoDialog
