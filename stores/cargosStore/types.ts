import {
  CARGO_IMAGE_STATUS,
  CARGO_STATUS,
  UPLOAD_IMAGE_STATUS
} from "@/stores/cargosStore/const"

export type cargoStatusType = typeof CARGO_STATUS[keyof typeof CARGO_STATUS]

export type cargoFieldNamesType<Type> = {
  [key: string]: {
    label: string,
    value: string,
    defaultValue?: Type
  }
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
export type spaceItemIdType = string
export type spaceItemType = {
  id: spaceItemIdType
  clientId: clientIdType
  cargoId?: string
  weight: number
  piecesInPlace: number
  photos: Array<UploadImageType>
}

export interface CargoInterface {
  status: cargoStatusType // Статус
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

export type CargoImageStatus = typeof CARGO_IMAGE_STATUS[keyof typeof CARGO_IMAGE_STATUS]
export type UploadImageStatus = typeof UPLOAD_IMAGE_STATUS[keyof typeof UPLOAD_IMAGE_STATUS]

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

// === FOR FUNCTIONS ===
// addPhoto
export type addPhotoSpaceInfoArgs = {
  spaceID: spaceItemIdType,
  spaceIndex: number
  clientId: string
  cargoId?: string
  isItEditForm: boolean
}

export type addPhotoFileInfoArgs = {
  file: File
  metadata: object
  fileIndex: number
}

// uploadCargoImage
export type uploadCargoImageFileDataArgs = {
  file: File
  metadata: object
}

export type uploadCargoImageSpaceDataArgs = {
  spaceIndexOfState: number
  spaceIndexOfForm: number
  photoIndex: number
  clientId: string
  cargoId?: string
  isItEditForm: boolean
}

type urlResType = {
  id: string
  url: string
}

export type uploadCargoImageResType = urlResType | null

// setUploadImageArgs
export type setUploadImageArgsType = {
  uploadStatus: UploadImageStatus
  spaceIndexOfState: number
  spaceIndexOfForm: number
  photoIndex: number
  clientId: string
  cargoId?: string
  isItEditForm: boolean
}

// updateUploadImage
export type updateUploadImageArgsType = {
  id: string
  spaceIndexOfState: number
  spaceIndexOfForm: number
  uploadStatus?: UploadImageStatus
  isShowProgress?: boolean
  progress?: number
  url?: string
  clientId: string
  cargoId?: string
  isItEditForm: boolean
}
