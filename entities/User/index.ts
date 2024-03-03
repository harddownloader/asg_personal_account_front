// api requests
export { updateUserData } from './api/updateUserData'
export { refreshAccessToken } from './api/refreshAccessToken'
export { getAllClients } from './api/getAllClients'
export { getMe } from './api/getMe'
export { registerUser } from './api/registerUser'

// api mappers
export { mapUserDataFromApi } from './api/mappers/mapUserDataFromApi'
export { mapUserDataToApi } from './api/mappers/mapUserDataToApi'

// validation
export { getUpdateUserErrorMsg } from './lib/validation/getUpdateUserErrorMsg'

// tokens
export { updateAndSet } from './lib/accessToken/updateAndSet'

// types
export type {
  // editClient
  ISaveClientProfile,

  // auth
  TLoginResponse,
  IRegisterUserData,
  TRegisterResponse,
  TAccessToken,
  TDecodedAccessToken,

  // profile
  IUserSecurityDataForSaving,
  TUserPasswordSavingResponse,
  IProfileContacts,

  // user
  TUserName,
  TUserEmail,
  TUserPhone,
  TUserId,
  TUserCodeId,
  TUserCity,
  TUserPassword,
  TUserRole,
  IUser,
  IUserOfDB,
  IUserStore,
  TUserSavingResponse,
  TUserOfARegionThatDoesNotYetExist,
  TUserOfAnExistingRegion,
  TUserCountry,
  ISaveContactUserDataArgs,
  IProfileSecurityFields,
} from './types'

// const
export {
  USERS_DB_COLLECTION_NAME,
  USER_ROLE,
  USER_DEFAULT_VALUES,
} from './consts'

// model
export { UserStore, ClientsStore } from './model'
