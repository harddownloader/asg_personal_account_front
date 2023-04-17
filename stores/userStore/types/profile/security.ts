import { User as FirebaseUser } from "@firebase/auth"
import { UserIdType, passwordType } from "@/stores/userStore/types/user"
import { responseFieldErrorsArray } from "@/lib/types"

export interface ProfileSecurityFields {
  currentPassword: passwordType,
  newPassword: passwordType,
  repeatNewPassword: passwordType
}

export interface UserSecurityDataForSaving {
  id: UserIdType
  currentPassword: passwordType,
  newPassword: passwordType,
  repeatNewPassword: passwordType
}

// responses structures
export type UserPasswordSavingResponse = {
  data: {
    accountSaving: {
      errors: responseFieldErrorsArray
      currentUser?: FirebaseUser
    }
  }
}
