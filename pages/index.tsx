import { ReactElement, useEffect } from "react"
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import nookies from "nookies"
import io from "Socket.IO-client"

// project components
import { AccountLayout } from "@/components/Layout"
import { CargosBlock } from "@/components/CargosBlock/CargosBlock"

// utils
import { getAllClients, getUserFromDB } from "@/lib/ssr/requests/getUsers"
import { firebaseAdmin } from "@/lib/firebase/firebaseAdmin"
import { firebaseClient } from "@/lib/firebase"
import { getNotifications } from "@/lib/ssr/requests/getNotifications"
import { getAllCargos, getCargosByClient } from "@/lib/ssr/requests/getCargos"
import { fixMeInTheFuture } from "@/lib/types"

// store
import CargosStore, { CargoInterfaceFull } from "@/stores/cargosStore"
import UserStore, { UserIdType, UserOfDB } from "@/stores/userStore"
import ClientsStore from "@/stores/clientsStore"
import NotificationsStore, { contentType, Notification } from "@/stores/notificationsStore"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    // if the user is authenticated
    const cookies = nookies.get(ctx)
    console.log(JSON.stringify(cookies, null, 2))
    const currentFirebaseUser = await firebaseAdmin.auth().verifyIdToken(cookies.token)

    const db = firebaseAdmin.firestore()
    const usersRef = await db.collection('users')

    const currentUserInDB: UserOfDB = await getUserFromDB({
      currentUserId: currentFirebaseUser.uid,
      usersRef
    })

    const isUserManager = currentUserInDB.role === 1

    const notificationsRef = await db.collection('notifications')
    const notifications: Array<Notification> = await getNotifications({
      currentUserId: currentFirebaseUser.uid,
      notificationsRef
    })

    const clients: Array<UserOfDB> | null = isUserManager
      ? await getAllClients({usersRef})
      : null

    const cargosRef = await db.collection('cargos')
    const allCargos = isUserManager
        ? await getAllCargos({cargosRef})
        : currentUserInDB?.userCodeId ? await getCargosByClient({
          cargosRef,
          userCodeId: currentUserInDB.userCodeId,
        }) : []

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

let socket: fixMeInTheFuture

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

    if (!UserStore.user.id) UserStore.saveUserToStore({...currentUserData})

    if (clients === null) ClientsStore.setCurrentItem({...currentUserData})
    else if (clients?.length) ClientsStore.setList(clients)

    if (notifications?.length) NotificationsStore.setList(notifications)
  })

  // useEffect(() => {
  //   socket = io('/api/socket')
  //
  //   socket.on('connect', () => {
  //     console.log('connected')
  //   })
  //
  //   if (currentUser.role === 1) socket.on('newUser', (msg: string) => {
  //     const newUserNotification = {
  //       userId: currentUser.id,
  //       content: msg,
  //       isViewed: false,
  //     }
  //     console.log({ newUserNotification })
  //     NotificationsStore.add(newUserNotification)
  //   })
  //
  //   return () => {
  //     socket.disconnect()
  //     socket.off()
  //   }
  // }, [])

  const socketInitializer = async () => {
    console.log('socketInitializer')
    // await fetch()
    socket = io('/api/socket')

    socket.on('connect', () => {
      console.log('connected')
    })

    if (currentUser.role === 1) socket.on('newUser', (msg: string) => {
      const newUserNotification = {
        userId: currentUser.id,
        content: msg,
        isViewed: false,
      }
      console.log({ newUserNotification })
      NotificationsStore.add(newUserNotification)
    })
  }

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
