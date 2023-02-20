import { makeAutoObservable } from 'mobx'
import { collection, doc, setDoc, addDoc } from "firebase/firestore"
import { firebaseAuth, firebaseFirestore } from "@/lib/firebase"

/*
* 0 - The shipment has arrived at the warehouse and is awaiting shipment.
* 1 - Cargo on the way
* 2 - The shipment has arrived at its destination
* 3 - Shipment received by customer
* */
export enum CargosStatusEnum {
  CARGO_WAITING_TO_BE_SEND = 0,
  CARGO_ON_THE_WAY = 1,
  CARGO_HAS_ARRIVED_AT_ITS_DESTINATION = 2,
  CARGO_RECEIVED_BY_CUSTOMER = 3
}
export const CARGO_WAITING_TO_BE_SEND = 0
export const CARGO_ON_THE_WAY = 1
export const CARGO_HAS_ARRIVED_AT_ITS_DESTINATION = 2
export const CARGO_RECEIVED_BY_CUSTOMER = 3

export const statusOptions = [
  {
    text: 'Прибыл на склад в Китае',
    value: CARGO_WAITING_TO_BE_SEND
  },
  {
    text: 'В пути',
    value: CARGO_ON_THE_WAY
  },
  {
    text: 'Прибыл на склад в Украину',
    value: CARGO_HAS_ARRIVED_AT_ITS_DESTINATION
  },
  {
    text: 'Получен клиентом',
    value: CARGO_RECEIVED_BY_CUSTOMER
  },
]

export type cargoFieldNamesType = {
  [key: string]: {
    label: string,
    value: string,
  }
}

export const CARGO_FIELD_NAMES: cargoFieldNamesType = {
  CARGO_ID: {
    label: 'Номер отправки',
    value: 'cargoId',
  },
  CLIENT_CODE: {
    label: 'Код клиента',
    value: 'clientCode',
  },
  DISPATCH_NUMBER: {
    label: 'Номер отправки',
    value: 'dispatchNumber',
  },
  NUMBER_OF_SEATS: {
    label: 'Кол-во мест',
    value: 'numberOfSeats',
  },
  STATUS: {
    label: 'Статус',
    value: 'status',
  },
  CARGO_PHOTO: {
    label: 'Фото',
    value: 'cargoPhoto',
  },
  COST_OF_DELIVERY: {
    label: 'Стоимость доставки($)',
    value: 'costOfDelivery',
  },
  CARGO_NAME: {
    label: 'Название груза',
    value: 'cargoName',
  },
  INSURANCE: {
    label: 'Страховка',
    value: 'insurance',
  },
  PIECES_IN_PLACE: {
    label: 'Шт в месте(шт.)',
    value: 'piecesInPlace',
  },
  COST: {
    label: 'Стоимость',
    value: 'cost',
  },
  SHIPPING_DATE: {
    label: 'Дата отгрузки',
    value: 'shippingDate',
  },
  VOLUME: {
    label: 'Объем',
    value: 'volume',
  },
  WEIGHT: {
    label: 'Вес(кг.)',
    value: 'weight',
  },
}

export interface CargoInterface {
  numberOfSeats: number // Кол-во мест
  status: CargosStatusEnum // Статус
  cargoPhoto: string | null // Фото
  costOfDelivery: string // Стоимость доставки
  cargoName: string // Название груза
  insurance: number // Страховка
  piecesInPlace: number // Шт в месте
  cost: number // Стоимость
  shippingDate: string // Дата отгрузки
  volume: number // Объем
  weight: number // Вес
}

export interface CargoInterfaceForForm extends CargoInterface {
  cargoId: string // Номер отправки
  clientCode: string // Код клиента
}

export interface CargoInterfaceFull extends CargoInterfaceForForm {
  id: string // index in DB
}

export interface AddCargoInterface extends CargoInterface {

}

export type CargosItems = Array<CargoInterfaceFull>

export interface CargoSavingResponse {
  data: {
    cargoSaving: {
      errors: Array<{
        field: string,
        message: string
      }>
      currentCargo?: CargoInterfaceFull
    }
  }
}

export interface CargoAddResponse {
  data: {
    addingCargo: {
      errors: Array<{
        field: string,
        message: string
      }>
      currentCargo?: CargoInterfaceFull
    }
  }
}

export type CargosState = {
  items: CargosItems
  currentItemsList: CargosItems
  currentItem: CargoInterfaceFull | null
  isCurrentItemsListArchive: boolean
  isLoading: boolean
}

class CargosStore {
  cargos: CargosState = {
    items: [],
    currentItemsList: [],
    currentItem: null,
    isCurrentItemsListArchive: false,
    isLoading: false,
  }

  constructor() {
    makeAutoObservable(this)
  }

  toggleIsCurrentItemsListArchive = (status: boolean) => {
    this.cargos.isCurrentItemsListArchive = status
  }

  setList = (cargos: CargosItems) => {
    this.cargos.items = [...cargos]
  }

  clearCurrentItemsList = () => {
    this.cargos.currentItemsList = []
  }

  clearCurrentItem = () => {
    this.cargos.currentItem = null
  }

  setCurrentItemsListByStatus = ({
                                   isArchive,
                                   currentUserCode,
                                 } : {
    isArchive: boolean,
    currentUserCode: string
  }) => {
    this.cargos.isCurrentItemsListArchive = isArchive
    this.cargos.currentItemsList = this.cargos.items.filter((cargo) => {
      return Boolean(
        isArchive
          ? Number(cargo.status) === CARGO_RECEIVED_BY_CUSTOMER
          : Number(cargo.status) !== CARGO_RECEIVED_BY_CUSTOMER
      ) && cargo.clientCode === currentUserCode
    })
  }

  setCurrentItem = (currentItem: CargoInterfaceFull) => {
    this.cargos.currentItem = {...currentItem}
  }

  add = async ({
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
         }: CargoInterfaceForForm) => {
    const response: CargoAddResponse = {
      data: {
        addingCargo: {
          errors: []
        }
      }
    }

    if (!firebaseAuth?.currentUser?.uid) {
      response.data.addingCargo.errors.push({
        field: 'client',
        message: `firebaseAuth?.currentUser?.uid, is not a found`
      })

      return response
    }

    this.cargos.isLoading = true
    const newCargoData: CargoInterfaceForForm = {
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
    }
    await addDoc(
      collection(firebaseFirestore, 'cargos'),
      newCargoData
    ).then((Doc) => {
      const newCargo = {
        ...newCargoData,
        id: Doc.id
      }

      // add to all cargos
      this.cargos.items = [
        ...this.cargos.items,
        newCargo
      ]

      // add for current cargo list
      if ((
        this.cargos.isCurrentItemsListArchive &&
        status === CARGO_RECEIVED_BY_CUSTOMER
      ) || (
        !this.cargos.isCurrentItemsListArchive &&
        status !== CARGO_RECEIVED_BY_CUSTOMER
      )) this.cargos.currentItemsList = [
        ...this.cargos.currentItemsList,
        newCargo
      ]

      // set as current item in info block
      this.cargos.currentItem = newCargo
    }).catch((e) => {
      console.error('addDoc(collection(firebaseFirestore, \'cargos\')')
    }).finally(() => {
      this.cargos.isLoading = false
    })

    return response
  }

  update = async ({
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
                 id,
               }: CargoInterfaceFull) => {
    const response: CargoSavingResponse = {
      data: {
        cargoSaving: {
          errors: []
        }
      }
    }

    if (!firebaseAuth?.currentUser?.uid) {
      response.data.cargoSaving.errors.push({
        field: 'client',
        message: `firebaseAuth?.currentUser?.uid, is not a found`
      })

      return response
    }

    this.cargos.isLoading = true

    const cargosRef = await doc(firebaseFirestore, 'cargos', id)
    const newCargoData: CargoInterfaceFull = {
      id,
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
    }
    const resSetDoc = await setDoc(
      cargosRef,
      newCargoData,
      { merge: false }
    ).then((docRef) => {
      console.log("Document written with ID: ", docRef)

      const cargosTmp = JSON.parse(JSON.stringify(this.cargos.items))
      const currentCargoIndex = cargosTmp.findIndex((cargo: CargoInterfaceFull) => cargo.id === id)
      cargosTmp[currentCargoIndex] = { ...newCargoData }
      this.cargos.items = cargosTmp

      // add/edit/delete from current cargo list
      const currCargoInItemsList = this.cargos.currentItemsList.findIndex((cargo) => cargo.id === id)
      if (
        currCargoInItemsList !== -1 &&
        (
          this.cargos.isCurrentItemsListArchive &&
          status === CARGO_RECEIVED_BY_CUSTOMER
        ) || (
          !this.cargos.isCurrentItemsListArchive &&
          status !== CARGO_RECEIVED_BY_CUSTOMER
        )
      ) {
        const currItemsListTmp = JSON.parse(JSON.stringify(this.cargos.currentItemsList))

        currItemsListTmp.splice(currCargoInItemsList, 1, newCargoData)
        this.cargos.currentItemsList = [...currItemsListTmp]
      } else if (currCargoInItemsList !== -1) {
        const currItemsListTmp = JSON.parse(JSON.stringify(this.cargos.currentItemsList))

        currItemsListTmp.splice(currCargoInItemsList, 1)
        this.cargos.currentItemsList = [...currItemsListTmp]
      } else {
        console.error('Something went wrong in add/edit/delete from current cargo list logic')
      }

      return docRef
    }).catch((error) => {
      console.error("Error adding user document: ", error)
      response.data.cargoSaving.errors.push({
        field: 'server',
        message: `addDoc was failed, error: ${error}`
      })

      return response
    }).finally(() => {
      this.cargos.isLoading = false
    })
    console.log({resSetDoc})

    return response
  }
}

export default new CargosStore()
