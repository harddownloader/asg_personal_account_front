import React, {Fragment, ReactElement, useEffect} from 'react'
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
  AddCargoInterface,
  CargoInterfaceForForm,
  CargoInterfaceFull,
  CargoAddResponse,
} from "@/stores/cargosStore"
import {UserCodeIdType, UserOfDB} from "@/stores/userStore"

export interface AddCargoDialogProps {
  isVisible: boolean,
  handleCancel: () => void,
  clientCode: UserCodeIdType,
}

export const AddCargoDialog = ({
                                 isVisible,
                                 handleCancel,
                                 clientCode,
}: AddCargoDialogProps) => {
  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
    reset,
    control,
  } = useForm<CargoInterfaceFull>({})

  useEffect(() => {
    if (clientCode) reset({ clientCode: clientCode })
  }, [clientCode])

  const handleAddCargo = handleSubmitForm(async ({
                                                    cargoId,
                                                    clientCode,
                                                    numberOfSeats,
                                                    status,
                                                    cargoPhoto,
                                                    costOfDelivery,
                                                    cargoName,
                                                    insurance,
                                                    piecesInPlace,
                                                    cost,
                                                    shippingDate,
                                                    volume,
                                                    weight,
                                                  }: CargoInterfaceForForm): Promise<void> => {
    const { data }: CargoAddResponse = await CargosStore.add({
      cargoId,
      clientCode,
      numberOfSeats,
      status,
      cargoPhoto,
      costOfDelivery,
      cargoName,
      insurance,
      piecesInPlace,
      cost,
      shippingDate,
      volume,
      weight,
    })

    if (data?.addingCargo?.errors.length) {
      // Unable to sign in.
      data?.addingCargo?.errors.forEach((e) => {
        if (e.field === "cargoId") {
          setErrorForm("cargoId", { message: e.message! })
        } else if (e.field === "clientCode") {
          setErrorForm("clientCode", { message: e.message! })
        } else if (e.field === "numberOfSeats") {
          setErrorForm("numberOfSeats", { message: e.message! })
        } else if (e.field === 'status') {
          setErrorForm("status", { message: e.message! })
        } else if (e.field === 'cargoPhoto') {
          setErrorForm("cargoPhoto", { message: e.message! })
        } else if (e.field === 'costOfDelivery') {
          setErrorForm("costOfDelivery", { message: e.message! })
        } else if (e.field === 'cargoName') {
          setErrorForm("cargoName", { message: e.message! })
        } else if (e.field === 'insurance') {
          setErrorForm("insurance", { message: e.message! })
        } else if (e.field === 'piecesInPlace') {
          setErrorForm("piecesInPlace", { message: e.message! })
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

    return
  })

  return (
    <DialogHOC
      isVisible={isVisible}
      isMobileVersion={false}
      title={'Добавить груз'}
      handleClose={handleCancel}
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
          formDefaultValues: {}
        }}
      />
    </DialogHOC>
  )
}

export default AddCargoDialog
