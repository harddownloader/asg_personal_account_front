import { UserStore } from './store'
export type {
  RegisterUserData,
  UserOfDB,
  UserSecurityDataForSaving,
  UserStoreInterface,
  UserCodeIdType,
  UserIdType,
  SaveClientProfileInterface,
  ProfileContacts,

  // responses
  LoginResponse,
  RegisterResponse,
  UserSavingResponse,
  UserPasswordSavingResponse,
} from './types'

export {
  USERS_DB_COLLECTION_NAME,
  USER_ROLE,
  USER_DEFAULT_VALUES,
} from './const'

export default new UserStore()
