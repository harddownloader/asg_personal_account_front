import {useEffect} from "react"
import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next"
import nookies from "nookies"

// utils
import {firebaseAdmin} from "@/lib/firebase/firebaseAdmin"
import {getUserFromDB} from "@/lib/ssr/requests/getUsers"

// store
import UserStore, {UserOfDB, USERS_DB_COLLECTION_NAME} from "@/stores/userStore"


function ProfileSecurity() {
  return(
    <>
      <p>ProfileSecurity</p>
    </>
  )
}

export default ProfileSecurity
