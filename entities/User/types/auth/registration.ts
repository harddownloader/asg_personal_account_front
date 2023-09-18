import { TResponseFieldErrorsArray } from "@/shared/types/types"
import { User as FirebaseUser } from "@firebase/auth"
import { IUser, TUserOfAnExistingRegion, TUserPassword } from '../user'

export interface IRegisterUserData extends IUser {
  password: TUserPassword
  repeatPassword: TUserPassword
  country: TUserOfAnExistingRegion /* reassigned, temporary solution */
}

// responses structures
export type TRegisterResponse = {
  data: {
    accountRegister: {
      errors: TResponseFieldErrorsArray
      currentUser?: FirebaseUser
    }
  }
}
