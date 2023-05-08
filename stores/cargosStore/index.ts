import { CargosStore } from './store'
export type {
  ICargoFull,
  UploadImageType,
  spaceItemIdType,
  spaceItemType,
  ICargoForForm,
  CargoAddResponse,
  CargoSavingResponse,
  spaceOfDB,
  spacePhotosOfDB,
  addPhotoSpaceInfoArgs,
} from './types'

export {
  CARGOS_DB_COLLECTION_NAME,
  CARGO_STATUS,
  STATUS_OPTIONS,
  CARGO_FIELD_NAMES,
  CARGO_IMAGE_STATUS,
  UPLOAD_IMAGE_STATUS,
} from './const'

export default new CargosStore()
