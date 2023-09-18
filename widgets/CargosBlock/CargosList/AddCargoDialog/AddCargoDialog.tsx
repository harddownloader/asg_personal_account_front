import { useEffect, useMemo } from 'react'
import { useForm } from "react-hook-form"
import { observer } from "mobx-react-lite"

// project components
import { CargosForm } from "@/widgets/CargosBlock/CargosForm"
import { DialogHOC } from '@/widgets/Dialog/Modal/DialogHOC'

// store
import { CargosStore, CARGO_FIELD_NAMES } from "@/entities/Cargo"
import type {
  ICargoForForm,
  ICargoFull,
  ICargoAddResponse,
  TSpaceItem,
} from '@/entities/Cargo'
import type { TUserCodeId, TUserId } from "@/entities/User"
import { getSpacesOfUnsavedCargo } from "@/entities/Cargo"

export interface AddCargoDialogProps {
  isVisible: boolean
  handleCancel: () => void
  clientCode: TUserCodeId
  clientId: TUserId | null
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
    setValue,
  } = useForm<ICargoFull>({})

  useEffect(() => {
    if (clientCode) reset({ clientCode: clientCode })
  }, [clientCode])

  const getCurrentNewTmpSpaces = (notLoadedSpaces: Array<TSpaceItem>) => {
    if (!clientId) {
      console.warn('getCurrentNewTmpSpaces: Not found clientId', { clientId })
      return []
    }

    const currentSpacesTmp = getSpacesOfUnsavedCargo({
      spaces: notLoadedSpaces,
      clientId
    })

    console.log('AddCargoDialog getCurrentNewTmpSpaces', {
      currentSpacesTmp,
      notLoadedSpaces
    })

    return currentSpacesTmp
  }

  const notLoadedSpacesSrt = JSON.stringify(CargosStore.cargos.notLoadedSpaces.list)
  const currentTmpSpaces = useMemo(
    () => getCurrentNewTmpSpaces(JSON.parse(notLoadedSpacesSrt)), [notLoadedSpacesSrt]
  )

  const handleAddCargo = handleSubmitForm(async ({
                                                    cargoId,
                                                    clientCode,
                                                    status,
                                                    costOfDelivery,
                                                    // cargoName,
                                                    insurance,
                                                    cost,
                                                    tariff,
                                                    volume,
                                                    weight,
                                                  }: ICargoForForm): Promise<void> => {

    // const currentTmpSpaces = getCurrentNewTmpSpaces(JSON.parse(notLoadedSpacesSrt))

    const { data }: ICargoAddResponse = await CargosStore.add({
      cargoId,
      clientCode,
      status,
      costOfDelivery,
      insurance,
      cost,
      tariff,
      volume,
      weight,
      spaces: currentTmpSpaces,
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
    const onlyExistsSpaces = tmpSpaces.filter((space: TSpaceItem): boolean => {
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
            status: CARGO_FIELD_NAMES.STATUS.defaultValue,
            volume: CARGO_FIELD_NAMES.VOLUME.defaultValue,
            weight: CARGO_FIELD_NAMES.WEIGHT.defaultValue,
            costOfDelivery: CARGO_FIELD_NAMES.COST_OF_DELIVERY.defaultValue,
          },
          reset,
          getValues,
          setValue,
        }}
        currentTmpSpaces={currentTmpSpaces}
        isItEditForm={false}
      />
    </DialogHOC>
  )
})

AddCargoDialog.displayName = 'AddCargoDialog'
