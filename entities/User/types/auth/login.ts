import { TResponseFieldErrorsArray } from "@/shared/types/types"
import { User as FirebaseUser } from "@firebase/auth"

// responses structures
export type TLoginResponse = {
  data: {
    tokenCreate: {
      errors: TResponseFieldErrorsArray
      currentUser?: FirebaseUser
    }
  }
}
