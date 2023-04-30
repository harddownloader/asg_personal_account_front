export const USERS_DB_COLLECTION_NAME: string = 'users' as const

export const USER_ROLE = {
  CLIENT: 0,
  MANAGER: 1
} as const

export const USER_DEFAULT_VALUES = {
  id: '',
  name: '',
  email: '',
  phone: '',
  city: null,
  role: USER_ROLE.CLIENT,
  userCodeId: null
} as const


