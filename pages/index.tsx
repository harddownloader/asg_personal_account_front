import { ReactElement, useEffect } from "react"
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import nookies from "nookies"

// project components
import { AccountLayout } from "@/components/Layout"
import { CargosBlock } from "@/components/CargosBlock/CargosBlock"

// utils
import { getAllClients, getUserFromDB } from "@/lib/ssr/requests/getUsers"
import { firebaseAdmin } from "@/lib/firebase/firebaseAdmin"
import { getNotifications } from "@/lib/ssr/requests/notifications/getNotifications"
import { getAllCargos, getCargosByClient } from "@/lib/ssr/requests/getCargos"

// store
import CargosStore, { CARGOS_DB_COLLECTION_NAME } from "@/stores/cargosStore"
import UserStore, {
  USER_ROLE,
  UserOfDB,
  USERS_DB_COLLECTION_NAME
} from "@/stores/userStore"
import ClientsStore from "@/stores/clientsStore"
import NotificationsStore, {
  Notification,
  NOTIFICATION_DB_COLLECTION_NAME
} from "@/stores/notificationsStore"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    // if the user is authenticated
    const cookies = nookies.get(ctx)
    const currentFirebaseUser = await firebaseAdmin.auth().verifyIdToken(cookies.token)

    const db = firebaseAdmin.firestore()
    const usersRef = await db.collection(USERS_DB_COLLECTION_NAME)

    const currentUserInDB: UserOfDB | void = await getUserFromDB({
      currentUserId: currentFirebaseUser.uid,
      usersRef
    }).catch((error) => console.error('getUserFromDB error', error))

    if (!currentUserInDB) return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    }

    const isUserManager = currentUserInDB.role === USER_ROLE.MANAGER

    const notificationsRef = await db.collection(NOTIFICATION_DB_COLLECTION_NAME)
    const notifications: Array<Notification> = await getNotifications({
      currentUserId: currentFirebaseUser.uid,
      notificationsRef
    })

    const clients: Array<UserOfDB> | null = isUserManager
      ? await getAllClients({usersRef})
      : null

    const cargosRef = await db.collection(CARGOS_DB_COLLECTION_NAME)
    const allCargos = isUserManager
        ? await getAllCargos({ cargosRef })
        : currentUserInDB?.userCodeId ? await getCargosByClient({
          cargosRef,
          userCodeId: currentUserInDB.userCodeId,
        }) : []


    return {
      props: {
        currentFirebaseUser,
        currentUser: {
          id: currentUserInDB.id,
          name: currentUserInDB.name,
          phone: currentUserInDB.phone,
          email: currentUserInDB.email,
          city: currentUserInDB.city,
          role: currentUserInDB.role,
          userCodeId: currentUserInDB.userCodeId,
        },
        notifications,
        clients,
        cargos: allCargos,
      },
    }
  } catch (err) {
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    // throw new Error(`${err}`)

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

function Home ({
                 cargos,
                 currentUser,
                 clients,
                 notifications,
               }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useEffect(() => {
    if (cargos?.length) CargosStore.setList(cargos)

    const currentUserData = {
      id: currentUser.id,
      name: currentUser.name,
      phone: currentUser.phone,
      email: currentUser.email,
      city: currentUser.city,
      role: currentUser.role,
      userCodeId: currentUser.userCodeId,
    }

    if (!UserStore.user.currentUser.id) UserStore.saveUserToStore({...currentUserData})

    if (clients === null) ClientsStore.setCurrentItem({...currentUserData})
    else if (clients?.length) ClientsStore.setList(clients)

    if (notifications?.length) NotificationsStore.setList(notifications)
  })

  return (
    <>
      <CargosBlock />
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>
}

export default Home
