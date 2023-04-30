import { User as FirebaseUser } from "@firebase/auth"
import { USER_ROLE } from '@/stores/userStore/const'
import { responseFieldErrorsArray } from "@/lib/types"

export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE]

export type UserName = string
export type UserEmail = string
export type UserPhone = string
export type UserIdType = string
export type UserCodeIdType = string | null
export type UserCityType = string | null
export type passwordType = string

export interface UserInterface {
  name: UserName
  email: UserEmail
  phone: UserPhone
}

export interface UserOfDB extends UserInterface {
  id: UserIdType
  userCodeId: UserCodeIdType
  city: UserCityType
  role: UserRole
}

export interface UserStoreInterface {
  currentUser: UserOfDB
  isLoading: boolean
}

// responses structures
export type UserSavingResponse = {
  data: {
    accountSaving: {
      errors: responseFieldErrorsArray
      currentUser?: FirebaseUser
    }
  }
}
