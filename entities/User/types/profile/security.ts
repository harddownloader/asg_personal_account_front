import { User as FirebaseUser } from "@firebase/auth"
import type { TUserPassword, TUserCountry, TUserId } from "@/entities/User"
import type { TResponseFieldErrorsArray } from "@/shared/types/types"

export interface IProfileSecurityFields {
  currentPassword: TUserPassword
  newPassword: TUserPassword
  repeatNewPassword: TUserPassword
}

export interface IUserSecurityDataForSaving {
  currentPassword: TUserPassword
  newPassword: TUserPassword
  repeatNewPassword: TUserPassword
  id: TUserId
  country: TUserCountry
}

// responses structures
export type TUserPasswordSavingResponse = {
  data: {
    accountSaving: {
      errors: TResponseFieldErrorsArray
      currentUser?: FirebaseUser
    }
  }
}
