import React, {
  useEffect,
  useState,
  useMemo
} from 'react'
import { useForm } from "react-hook-form"
import { observer } from "mobx-react-lite"

// project components
import { CargosForm } from '@/components/CargosBlock/CargosForm'
import { ScrollableBlock } from "@/components/ui-component/ScrollableBlock"

// utils
import { prepareSpaces } from '@/components/CargosBlock/helpers/prepareBody'

// store
import CargosStore, {
  ICargoForForm,
  ICargoFull,
  CargoSavingResponse, spaceItemType, UploadImageType,
} from "@/stores/cargosStore"
import ClientsStore from "@/stores/clientsStore"

export interface CargosInfoProps {
  title: string,
  isFull: boolean
}

export const CargosInfo = observer(({
                             title,
                             isFull,
}: CargosInfoProps) => {
  const [isLoading, setLoading] = useState(true)

  // load current cargo
  const currentCargoStr = JSON.stringify(CargosStore.cargos?.currentItem)
  const currentCargo: ICargoFull | null = useMemo(
    () => {
      const currentItem = JSON.parse(currentCargoStr)
      return currentItem ? {...currentItem} : null
    },
    [currentCargoStr]
  )

  // load current client
  const currentClientStr = JSON.stringify(ClientsStore.clients?.currentItem)
  const currentClient = useMemo(
    () => {
      const currentItem = JSON.parse(currentClientStr)
      return currentItem ? {...currentItem} : null
    },
    [currentClientStr]
  )

  useEffect(() => {
    setLoading(false)

    const currentSpacesTmp = getCurrentTmpSpaces(JSON.parse(notLoadedSpacesSrt))
    initTmpSpaces(currentSpacesTmp)
  }, [])

  useEffect(() => {
    if (currentCargo?.id) {
      resetCargoForm()
    }
  }, [currentCargo?.id])

  const convertSpacesOfDbToStorageFormat = ({
                                              spaces,
                                              clientId,
                                              cargoId,
                                            }: {
                                              spaces: Array<spaceItemType>
                                              clientId: string
                                              cargoId: string
  }): Array<spaceItemType> => {
    const newTmpSpaceItems: Array<spaceItemType> = spaces.map((space: spaceItemType) => {
      const generateItemArgs: {
        clientId: string
        cargoId?: string
        id: string
        photos: Array<UploadImageType>
        weight: number
        piecesInPlace: number
      } = {
        id: space.id,
        clientId: clientId,
        cargoId: cargoId,
        photos: space.photos,
        weight: space.weight,
        piecesInPlace: space.piecesInPlace,
      }
      const spaceItem = CargosStore.generateSpaceItem(generateItemArgs)

      return {...spaceItem}
    })

    return newTmpSpaceItems
  }

  const initTmpSpaces = (currentSpacesTmp: Array<spaceItemType>) => {
    if (!currentSpacesTmp.length && currentCargo?.spaces?.length) {
      // init tmp spaces for current cargo
      const newTmpSpaceItems: Array<spaceItemType> = convertSpacesOfDbToStorageFormat({
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

  const getCurrentTmpSpaces = (notLoadedSpaces: Array<spaceItemType>) => {
    if (!currentClient?.id) {
      console.warn('Not found currentClient.id')
      return []
    }
    if (!currentCargo?.id) {
      console.warn('Not found currentCargo.id')
      return []
    }
    const filterCallback = (space: spaceItemType): boolean => {
      return (
        space.clientId === currentClient.id &&
        space.cargoId === currentCargo.id
      )
    }

    const currentSpacesTmp = notLoadedSpaces.filter(filterCallback)

    // const newCurrentTmpSpaceItems: Array<spaceItemType> = convertSpacesOfDbToStorageFormat({
    //   spaces: currentSpacesTmp,
    //   clientId: currentClient.id,
    //   cargoId: currentCargo.id
    // })

    return currentSpacesTmp
  }

  // load spaces tmp storage
  const notLoadedSpacesSrt = JSON.stringify(CargosStore.cargos.notLoadedSpaces.list)

  const formDefaultValues = currentCargo?.id
    ? {
        // id: currentCargo.id,
        cargoId: currentCargo.cargoId,
        clientCode: currentCargo.clientCode,
        status: currentCargo.status,
        costOfDelivery: currentCargo.costOfDelivery,
        cargoName: currentCargo.cargoName,
        insurance: currentCargo.insurance,
        cost: currentCargo.cost,
        tariff: currentCargo.tariff,
        volume: currentCargo.volume,
        weight: currentCargo.weight,
        spaces: currentCargo?.spaces,
      }
    : {}

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    setError: setErrorForm,
    reset,
    control,
    getValues,
  } = useForm<ICargoFull>({
    defaultValues: formDefaultValues
  })

  const resetCargoForm = () => {
    // for use form
    reset(formDefaultValues)

    const currentSpacesTmp = getCurrentTmpSpaces(JSON.parse(notLoadedSpacesSrt))
    initTmpSpaces(currentSpacesTmp)
  }

  const handleSaveCargo = handleSubmitForm(async ({
                                                    cargoId,
                                                    clientCode,
                                                    status,
                                                    costOfDelivery,
                                                    cargoName,
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

    const { data }: CargoSavingResponse = await CargosStore.update({
      id: currentCargo.id,
      cargoId,
      clientCode,
      status,
      costOfDelivery,
      cargoName,
      insurance,
      cost,
      tariff,
      volume,
      weight,
      spaces: prepareSpaces(currentTmpSpaces),
      createdAt: new Date(currentCargo.createdAt),
      updatedAt: new Date(),
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
        } else if (e.field === 'cargoName') {
          setErrorForm("cargoName", { message: e.message! })
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
      <ScrollableBlock
        isLoading={isLoading}
        isScrollable
      >
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
            reset,
            getValues,
          }}
          currentTmpSpaces={getCurrentTmpSpaces(JSON.parse(notLoadedSpacesSrt))}
          isItEditForm={true}
        />
      </ScrollableBlock>
    </>
  )
})

export default CargosInfo
