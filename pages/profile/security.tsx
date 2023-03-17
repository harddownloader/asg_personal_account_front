import {useEffect} from "react"
import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next"
import nookies from "nookies"

// utils
import {firebaseAdmin} from "@/lib/firebase/firebaseAdmin"
import {getUserFromDB} from "@/lib/ssr/requests/getUsers"

// store
import UserStore, {UserOfDB, USERS_DB_COLLECTION_NAME} from "@/stores/userStore"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    // if the user is authenticated
    const cookies = nookies.get(ctx)
    // console.log(JSON.stringify(cookies, null, 2))
    const currentFirebaseUser = await firebaseAdmin.auth().verifyIdToken(cookies.token)
    const db = firebaseAdmin.firestore()
    const usersRef = await db.collection(USERS_DB_COLLECTION_NAME)
    const currentUserInDB: UserOfDB = await getUserFromDB({
      currentUserId: currentFirebaseUser.uid,
      usersRef
    })

    return {
      props: {
        currentUser: {
          id: currentUserInDB.id,
          name: currentUserInDB.name,
          phone: currentUserInDB.phone,
          email: currentUserInDB.email,
          city: currentUserInDB.city,
          role: currentUserInDB.role,
          userCodeId: currentUserInDB.userCodeId,
        },
      },
    }
  } catch (err) {
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      // `as never` is required for correct type inference
      // by InferGetServerSidePropsType below
      props: {} as never,
    }
  }
}

function ProfileSecurity({ currentUser }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useEffect(() => {
    if(!UserStore.user.currentUser.id) UserStore.saveUserToStore({
      id: currentUser.id,
      name: currentUser.name,
      phone: currentUser.phone,
      email: currentUser.email,
      city: currentUser.city,
      role: currentUser.role,
      userCodeId: currentUser.userCodeId,
    })
  })

  return(
    <>
      <p>ProfileSecurity</p>
    </>
  )
}

export default ProfileSecurity
