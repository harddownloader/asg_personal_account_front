import React, { ReactElement, useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import {observer} from "mobx-react-lite"

// mui
import { CardContent, Grid, Typography } from '@mui/material'
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import MainCard from "@/components/ui-component/cards/MainCard"
import TextField from "@mui/material/TextField"

// project components
import SkeletonPopularCard from "@/components/ui-component/cards/Skeleton/PopularCard"
import { CargosForm } from '@/components/CargosBlock/CargosForm'

// utils
import { GRID_SPACING } from '@/lib/const'
import { fixMeInTheFuture } from '@/lib/types'

// store
import CargosStore, {
  CargoInterfaceForForm,
  CargoInterfaceFull,
  CargoSavingResponse,
} from "@/stores/cargosStore"

export interface CargosInfoProps {
  title: string,
  isFull: boolean
}

export const CargosInfo = observer(({
                             title,
                             isFull,
}: CargosInfoProps) => {
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const currentCargo = CargosStore.cargos?.currentItem
  const formDefaultValues = currentCargo?.id
    ? {
        // id: currentCargo.id,
        cargoId: currentCargo.cargoId,
        clientCode: currentCargo.clientCode,
        numberOfSeats: currentCargo.numberOfSeats,
        status: currentCargo.status,
        cargoPhoto: currentCargo.cargoPhoto,
        costOfDelivery: currentCargo.costOfDelivery,
        cargoName: currentCargo.cargoName,
        insurance: currentCargo.insurance,
        piecesInPlace: currentCargo.piecesInPlace,
        cost: currentCargo.cost,
        shippingDate: currentCargo.shippingDate,
        volume: currentCargo.volume,
        weight: currentCargo.weight,
        //  spaces: []
      }
    : {}

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
    reset,
    control,
  } = useForm<CargoInterfaceFull>({
    defaultValues: formDefaultValues
  })

  useEffect(() => {
    if (currentCargo?.id) {
      reset(formDefaultValues)
    }
  }, [currentCargo?.id])

  const handleSaveCargo = handleSubmitForm(async ({
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
    if (!currentCargo?.id) return

    const { data }: CargoSavingResponse = await CargosStore.update({
      id: currentCargo.id,
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

    if (data?.cargoSaving?.errors.length) {
      // Unable to sign in.
      data?.cargoSaving?.errors.forEach((e) => {
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

    return
  })


  return (
    <>
      {isLoading ? (
          <SkeletonPopularCard />
        ) : (
        <MainCard content={false} isHeightFull>
          <CardContent>
              <CargosForm
                isFull={isFull}
                isContentVisible={Boolean(CargosStore.cargos.currentItem)}
                title={title}
                handleSubmit={handleSaveCargo}
                formControl={{
                  registerForm,
                  errorsForm,
                  setErrorForm,
                  control,
                  formDefaultValues,
                }}
              />
          </CardContent>
        </MainCard>
        )}
    </>
  )
})

export default CargosInfo
