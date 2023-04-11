import { CargosStore } from './store'
export type {
  CargoInterfaceFull,
  UploadImageType,
  spaceItemType,
  CargoInterfaceForForm,
  CargoAddResponse,
  CargoSavingResponse,
  spaceOfDB,
  spacePhotosOfDB,
} from './types'

export {
  UPLOAD_IMAGE_STATUS_UPLOADING,
  UPLOAD_IMAGE_STATUS_SUCCESS,
  UPLOAD_IMAGE_STATUS_ERROR,
  CARGO_FIELD_NAMES,
  statusOptions,
  CARGOS_DB_COLLECTION_NAME,
} from './types'

export default new CargosStore()
