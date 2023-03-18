import { ReactElement, useEffect } from "react"
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next"
import nookies from "nookies"
import { io } from "socket.io-client"

// project components
import { AccountLayout } from "@/components/Layout"
import { CargosBlock } from "@/components/CargosBlock/CargosBlock"

// utils
import { getAllClients, getUserFromDB } from "@/lib/ssr/requests/getUsers"
import { firebaseAdmin } from "@/lib/firebase/firebaseAdmin"
import { getNotifications } from "@/lib/ssr/requests/notifications/getNotifications"
import { getAllCargos, getCargosByClient } from "@/lib/ssr/requests/getCargos"
import { fixMeInTheFuture } from "@/lib/types"
import { notificationAudioPlay } from "@/lib/audio"

// store
import CargosStore, { CargoInterfaceFull, CARGOS_DB_COLLECTION_NAME } from "@/stores/cargosStore"
import UserStore, { USER_ROLE_MANAGER, UserOfDB, USERS_DB_COLLECTION_NAME } from "@/stores/userStore"
import ClientsStore from "@/stores/clientsStore"
import NotificationsStore, { Notification, NOTIFICATION_DB_COLLECTION_NAME } from "@/stores/notificationsStore"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    // if the user is authenticated
    const cookies = nookies.get(ctx)
    console.log('Home getServerSideProps in try', {
      cookies: JSON.stringify(cookies, null, 2),
      'cookies.token': cookies.token,
      'typeof cookies.token': typeof cookies.token,
    })
    const currentFirebaseUser = await firebaseAdmin.auth().verifyIdToken(cookies.token)

    const db = firebaseAdmin.firestore()
    const usersRef = await db.collection(USERS_DB_COLLECTION_NAME)

    const currentUserInDB: UserOfDB = await getUserFromDB({
      currentUserId: currentFirebaseUser.uid,
      usersRef
    })

    const isUserManager = currentUserInDB.role === USER_ROLE_MANAGER

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
    const cookies = nookies.get(ctx)
    console.log('Home getServerSideProps in try', {
      cookies: JSON.stringify(cookies, null, 2),
      'cookies.token': cookies.token,
      'typeof cookies.token': typeof cookies.token,
      errorMessage: err,
    })
    const currentFirebaseUser = await firebaseAdmin.auth().verifyIdToken(cookies.token)

    return {
      // redirect: {
      //   permanent: false,
      //   destination: "/login",
      // },
      // `as never` is required for correct type inference
      // by InferGetServerSidePropsType below
      props: {
        error_msg: err,
        currentFirebaseUser,
        token: cookies.token,
      } as never,
    }
  }
}

let socket: fixMeInTheFuture

function Home ({
                 cargos,
                 currentUser,
                 clients,
                 notifications,
                 currentFirebaseUser,
               }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log({
    cargos,
    currentUser,
    clients,
    notifications,
    currentFirebaseUser,
  })
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

  useEffect(() => {
    socketInitializer()

    return () => {
      console.log('unmount')
    }
  }, [])

  const socketInitializer = async () => {
    console.log('socketInitializer')

    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected, socket.id', socket.id)
      socket.emit('connect user', {
        socketId: socket.id,
        userId: currentUser.id
      })
    })

    socket.on("disconnect", () => {
      console.log('disconnect socket.id', socket.id) // undefined
    })

    if (currentUser.role === USER_ROLE_MANAGER) socket.on('newUser', (notifications: Array<Notification>) => {
      console.log({ notifications })
      notificationAudioPlay()

      const currentNotification = notifications.find((notification) => notification.userId === currentUser.id)
      if (!currentNotification) {
        console.warn('ws notification for current user not found')
        return
      }
      const newUserNotification = {
        id: currentNotification.id,
        userId: currentNotification.userId,
        content: currentNotification.content,
        isViewed: currentNotification.isViewed,
      }
      console.log('newUserNotification', { ...newUserNotification })
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
