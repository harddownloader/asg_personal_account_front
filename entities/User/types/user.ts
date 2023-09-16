import { User as FirebaseUser } from "@firebase/auth"
import { USER_ROLE } from '@/entities/User'
import { TResponseFieldErrorsArray } from "@/shared/types/types"

export type TUserRole = typeof USER_ROLE[keyof typeof USER_ROLE]

export type TUserName = string
export type TUserEmail = string
export type TUserPhone = string
export type TUserId = string
export type TUserCodeId = string | null
export type TUserCity = string | null
export type TUserPassword = string
export type TUserOfARegionThatDoesNotYetExist = null
export type TUserOfAnExistingRegion = string
export type TUserCountry = TUserOfAnExistingRegion | TUserOfARegionThatDoesNotYetExist

export interface IUser {
  name: TUserName
  email: TUserEmail
  phone: TUserPhone
  country: TUserCountry
}

export interface IUserOfDB extends IUser {
  id: TUserId
  userCodeId: TUserCodeId
  city: TUserCity
  role: TUserRole
}

export interface IUserStore {
  currentUser: IUserOfDB
  isLoading: boolean
}

// responses structures
export type TUserSavingResponse = {
  data: {
    accountSaving: {
      errors: TResponseFieldErrorsArray
      currentUser?: FirebaseUser
    }
  }
}
