import {
  CARGO_IMAGE_STATUS,
  CARGO_STATUS,
  UPLOAD_IMAGE_STATUS
} from "@/stores/cargosStore/const"
import { responseFieldErrorsArray } from "@/lib/types"

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

export type CargoID = string
export type CargoCustomIdentify = string
export type CargoClientCodeType = string
export type CargoStatusType = typeof CARGO_STATUS[keyof typeof CARGO_STATUS] // Статус
export type CargoCostOfDeliveryType = string // Стоимость доставки
export type CargoNameType = string // Название груза
export type CargoInsuranceType = number // Страховка
export type CargoCostType = number // Стоимость
export type CargoTariffType = string // Дата отгрузки
export type CargoVolumeType = number // Объем
export type CargoWeightType = number // Вес

export interface ICargo {
  status: CargoStatusType
  costOfDelivery: CargoCostOfDeliveryType
  cargoName: CargoNameType
  insurance: CargoInsuranceType
  cost: CargoCostType
  tariff: CargoTariffType
  volume: CargoVolumeType
  weight: CargoWeightType
}

export interface ICargoDateTime {
  createdAt: Date | string
  updatedAt: Date | string
}

export interface ICargoLocalFormat extends ICargo {
  spaces: Array<spaceItemType>
}

export interface ICargoDBFormatWithoutId extends ICargo, ICargoDateTime {
  spaces: Array<spaceOfDB>
  cargoId: CargoCustomIdentify // Номер отправки
  clientCode: CargoClientCodeType // Код клиента
}

export interface ICargoDBFormat extends ICargoDBFormatWithoutId {
  id: CargoID // index in DB
}

export interface ICargoForForm extends ICargoLocalFormat {
  cargoId: CargoCustomIdentify // Номер отправки
  clientCode: CargoClientCodeType // Код клиента
}

export interface ICargoFull extends ICargoForForm, ICargoDateTime {
  id: CargoID // index in DB
}

export interface IAddCargo extends ICargo, ICargoDateTime {
  spaces: Array<spaceOfDB>
  cargoId: CargoCustomIdentify // Номер отправки
  clientCode: CargoClientCodeType // Код клиента
}

export type CargosItems = Array<ICargoFull>

export interface CargoSavingResponse {
  data: {
    cargoSaving: {
      errors: responseFieldErrorsArray
      currentCargo?: ICargoFull
    }
  }
}

export interface CargoAddResponse {
  data: {
    addingCargo: {
      errors: responseFieldErrorsArray
      currentCargo?: ICargoFull
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
  currentItem: ICargoFull | null
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
