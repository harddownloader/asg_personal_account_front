import { responseFieldErrorsArray } from "@/lib/types"
import { User as FirebaseUser } from "@firebase/auth"
import { UserInterface, passwordType } from '../user'

export interface RegisterUserData extends UserInterface {
  password: passwordType,
  repeatPassword: passwordType,
}

// responses structures
export type RegisterResponse = {
  data: {
    accountRegister: {
      errors: responseFieldErrorsArray
      currentUser?: FirebaseUser
    }
  }
}
