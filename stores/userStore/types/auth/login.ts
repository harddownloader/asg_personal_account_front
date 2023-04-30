import { responseFieldErrorsArray } from "@/lib/types"
import { User as FirebaseUser } from "@firebase/auth"

// responses structures
export type LoginResponse = {
  data: {
    tokenCreate: {
      errors: responseFieldErrorsArray
      currentUser?: FirebaseUser
    }
  }
}
