export const USERS_DB_COLLECTION_NAME: string = 'users' as const

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


