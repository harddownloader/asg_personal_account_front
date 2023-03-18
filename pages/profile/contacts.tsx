import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import nookies from "nookies"
import { firebaseAdmin } from "@/lib/firebase/firebaseAdmin"
import { useEffect } from "react"
import UserStore, { UserOfDB, USERS_DB_COLLECTION_NAME } from "@/stores/userStore"
import { getUserFromDB } from "@/lib/ssr/requests/getUsers"


function ProfileContacts() {
  return(
    <>
      <p>ProfileContacts</p>
    </>
  )
}

export default ProfileContacts
