import { useEffect } from "react"
import { UserStore } from "@/entities/User"


/* for login and registration page */
export const useAuthLoaderController = () => {
  /*
  * This is because there is a delay between the end of authorization and the display of the home page.
  * That's why we can't immediately remove the loading display after processing the login/registration request
  * (it's strange if the loading completes and the user sees the main page of the personal account only after a few minutes).
  *
  * In addition, the user may voluntarily go to the registration or login page, in which case we will kill their authorization.
  *
  * Also the state of this loader is used on the profile page.
  * */
  useEffect(() => {
    UserStore.setIsLoading(false)

    return () => {
      UserStore.setIsLoading(false)
    }
  }, [])
}
