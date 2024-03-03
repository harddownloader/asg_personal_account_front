export const USERS_DB_COLLECTION_NAME: string = 'users' as const
export const DB_COLLECTION_PREFIX_FOR_NOT_EXISTS_REGION_OF_USERS: string = 'NONE' as const

export const USER_ROLE = {
  CLIENT: 0,
  MANAGER: 1,
  ADMIN: 2
} as const

export const USER_DEFAULT_VALUES = {
  id: '',
  name: '',
  email: '',
  phone: '',
  city: null,
  country: null,
  role: USER_ROLE.CLIENT,
  userCodeId: null
} as const


