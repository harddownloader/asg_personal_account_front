export const CARGOS_DB_COLLECTION_NAME: string = 'cargos'

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

export type cargoFieldNamesType<Type> = {
  [key: string]: {
    label: string,
    value: string,
    defaultValue?: Type
  }
}

export const CARGO_FIELD_NAMES: cargoFieldNamesType<string | number> = {
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
    defaultValue: 0,
  },
  COST: {
    label: 'Стоимость груза',
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
    defaultValue: 0,
  },
}

// SPACES PHOTOS data format in DB
export type spacePhotosOfDB = {
  id: string
  photoIndex: number
  url: string
}

// SPACES data format in DB
export type spaceOfDB = {
  id: string
  weight: number
  piecesInPlace: number
  photos: Array<spacePhotosOfDB>
}

// SPACES data format in local state
export type clientIdType = string
export type spaceItemType = {
  id: string,
  clientId: clientIdType,
  cargoId?: string,
  weight: number,
  piecesInPlace: number,
  photos: Array<UploadImageType>
}

export interface CargoInterface {
  status: CargosStatusEnum // Статус
  costOfDelivery: string // Стоимость доставки
  cargoName: string // Название груза
  insurance: number // Страховка
  cost: number // Стоимость
  shippingDate: string // Дата отгрузки
  volume: number // Объем
  weight: number // Вес
}

export type CargoID = string
export type CargoCustomIdentify = string
export type CargoClientCode = string

export interface CargoInterfaceLocalFormat extends CargoInterface {
  spaces: Array<spaceItemType>
}

export interface CargoInterfaceDBFormat extends CargoInterface {
  spaces: Array<spaceOfDB>
  cargoId: CargoCustomIdentify // Номер отправки
  clientCode: CargoClientCode // Код клиента
  id: CargoID // index in DB
}

export interface CargoInterfaceForForm extends CargoInterfaceLocalFormat {
  cargoId: CargoCustomIdentify // Номер отправки
  clientCode: CargoClientCode // Код клиента
}

export interface CargoInterfaceFull extends CargoInterfaceForForm {
  id: CargoID // index in DB
}

export interface AddCargoInterface extends CargoInterface {
  spaces: Array<spaceOfDB>
  cargoId: CargoCustomIdentify // Номер отправки
  clientCode: CargoClientCode // Код клиента
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

export enum CargoImageStatus {
  FILE_WAS_ALREADY_LOADED = 0, // cargo info was saved
  FILE_JUST_UPLOADED = 1, // new cargo info wasn't saved
}

export const IMAGE_STATUS_FILE_WAS_ALREADY_LOADED = 0
export const IMAGE_STATUS_FILE_JUST_UPLOADED = 1

export enum UploadImageStatus {
  UPLOADING = 0,
  SUCCESS = 1,
  ERROR = -1,
}

export const UPLOAD_IMAGE_STATUS_UPLOADING: UploadImageStatus.UPLOADING = 0
export const UPLOAD_IMAGE_STATUS_SUCCESS: UploadImageStatus.SUCCESS = 1
export const UPLOAD_IMAGE_STATUS_ERROR: UploadImageStatus.ERROR = -1

// state for showing upload images animation
export type UploadImageType = {
  id: string
  status: CargoImageStatus
  uploadStatus: UploadImageStatus
  progress?: number
  isShowProgress: boolean
  spaceIndex: number
  photoIndex: number
  url: string | null
}

export type numberOfPhotosCurrentlyBeingUploadedType = number

export type NotUploadedSpaces = {
  list: Array<spaceItemType>
  numberOfPhotosCurrentlyBeingUploaded: numberOfPhotosCurrentlyBeingUploadedType
}

export type CargosState = {
  items: CargosItems
  currentItemsList: CargosItems
  currentItem: CargoInterfaceFull | null
  isCurrentItemsListArchive: boolean
  isLoading: boolean
  notLoadedSpaces: NotUploadedSpaces
}

type urlResType = {
  id: string
  url: string
}

export type uploadCargoImageResType = urlResType | null
