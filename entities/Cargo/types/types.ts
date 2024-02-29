import {
  CARGO_IMAGE_STATUS,
  CARGO_STATUS,
  UPLOAD_IMAGE_STATUS
} from "@/entities/Cargo"
import { TResponseFieldErrorsArray } from "@/shared/types/types"
import type { TUserId } from "@/entities/User"

export type TCargoFieldNames<Type> = {
  [key: string]: {
    label: string,
    value: string,
    defaultValue?: Type
  }
}

// SPACES PHOTOS data format in DB
export type TSpacePhotosOfDB = {
  id: string
  photoIndex: number
  url: string
}

// SPACES data format in DB
export type TSpaceOfDB = {
  id: string
  weight: number
  piecesInPlace: number
  volume: number
  cargoName: string
  photos: Array<TSpacePhotosOfDB>
}

// SPACES data format in local state
export type TClientId = string
export type TSpaceItemId = string
export type TSpaceItem = {
  id: TSpaceItemId
  clientId: TClientId
  cargoId?: string
  weight: number
  volume: number
  cargoName: string
  piecesInPlace: number
  photos: Array<TUploadImage>
}

export type TCargoID = string
export type TCargoCustomIdentify = string
export type TCargoClientCode = string
export type TCargoStatus = typeof CARGO_STATUS[keyof typeof CARGO_STATUS] // Статус
export type TCargoCostOfDelivery = number // Стоимость доставки
// export type CargoNameType = string // Название груза
export type TCargoInsurance = number // Страховка
export type TCargoCost = number // Стоимость
export type TCargoTariff = number // Тариф
export type TCargoVolume = number // Объем
export type TCargoWeight = number // Вес
export type TCargoToneId = string // foreign key to Tones collection

export interface ICargo {
  toneId: TCargoToneId
  status: TCargoStatus
  costOfDelivery: TCargoCostOfDelivery
  // cargoName: CargoNameType
  insurance: TCargoInsurance
  cost: TCargoCost
  tariff: TCargoTariff
  volume: TCargoVolume
  weight: TCargoWeight
}

export interface ICargoDateTime {
  createdAt: string
  updatedAt: string
}

export interface ICargoLocalFormat extends ICargo {
  spaces: Array<TSpaceItem>
}

export interface ICargoDBFormatWithoutId extends ICargo, ICargoDateTime {
  spaces: Array<TSpaceOfDB>
  cargoId: TCargoCustomIdentify // Номер отправки
  clientCode: TCargoClientCode // Код клиента
}

export interface IUpdateCargoReqBody extends ICargoDBFormatWithoutId {
  clientId: TUserId // user id
}

export interface ICargoDBFormat extends ICargoDBFormatWithoutId {
  id: TCargoID // index in DB
}

export interface ICargoForForm extends ICargoLocalFormat {
  cargoId: TCargoCustomIdentify // Номер отправки
  clientCode: TCargoClientCode // Код клиента
}

export interface ICargoFull extends ICargoForForm, ICargoDateTime {
  id: TCargoID // index in DB
  clientId: TUserId // user id
}

export interface IAddCargo extends ICargo, ICargoDateTime {
  spaces: Array<TSpaceOfDB>
  cargoId: TCargoCustomIdentify // Номер отправки
  clientCode: TCargoClientCode // Код клиента
  clientId: TUserId // user id
}

export type TCargosItems = Array<ICargoFull>

export interface ICargoSavingResponse {
  data: {
    cargoSaving: {
      errors: TResponseFieldErrorsArray
      currentCargo?: ICargoFull
    }
  }
}

export interface ICargoAddResponse {
  data: {
    addingCargo: {
      errors: TResponseFieldErrorsArray
      currentCargo?: ICargoFull
    }
  }
}

export type TCargoImageStatus = typeof CARGO_IMAGE_STATUS[keyof typeof CARGO_IMAGE_STATUS]
export type TUploadImageStatus = typeof UPLOAD_IMAGE_STATUS[keyof typeof UPLOAD_IMAGE_STATUS]

// state for showing upload images animation
export type TUploadImage = {
  id: string
  status: TCargoImageStatus
  uploadStatus: TUploadImageStatus
  progress?: number
  isShowProgress: boolean
  spaceIndex: number
  photoIndex: number
  url: string | null
}

export type TNumberOfPhotosCurrentlyBeingUploaded = number

export type TNotUploadedSpaces = {
  list: Array<TSpaceItem>
  numberOfPhotosCurrentlyBeingUploaded: TNumberOfPhotosCurrentlyBeingUploaded
}

export type TCargosState = {
  items: TCargosItems
  currentItemsList: TCargosItems
  currentItem: ICargoFull | null
  isCurrentItemsListArchive: boolean
  isLoading: boolean
  notLoadedSpaces: TNotUploadedSpaces
}

// === FOR FUNCTIONS ===
// addPhoto
export type TAddPhotoSpaceInfoArgs = {
  spaceID: TSpaceItemId,
  spaceIndex: number
  clientId: string
  cargoId?: string
  isItEditForm: boolean
}

export type TAddPhotoFileInfoArgs = {
  file: File
  metadata: object
  fileIndex: number
}

// uploadCargoImage
export type TUploadCargoImageFileDataArgs = {
  file: File
  metadata: object
}

export type TUploadCargoImageSpaceDataArgs = {
  spaceIndexOfState: number
  spaceIndexOfForm: number
  photoIndex: number
  clientId: string
  cargoId?: string
  isItEditForm: boolean
}

type TUrlRes = {
  id: string
  url: string
}

export type TUploadCargoImageRes = TUrlRes | null

// setUploadImageArgs
export type TSetUploadImageArgs = {
  uploadStatus: TUploadImageStatus
  spaceIndexOfState: number
  spaceIndexOfForm: number
  photoIndex: number
  clientId: string
  cargoId?: string
  isItEditForm: boolean
}

// updateUploadImage
export type TUpdateUploadImageArgs = {
  id: string
  spaceIndexOfState: number
  spaceIndexOfForm: number
  uploadStatus?: TUploadImageStatus
  isShowProgress?: boolean
  progress?: number
  url?: string
  clientId: string
  cargoId?: string
  isItEditForm: boolean
}
