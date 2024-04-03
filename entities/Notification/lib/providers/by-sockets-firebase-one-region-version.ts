/*
* There are a old version.
* We saved it to have relevant example.
* */
import { io } from "socket.io-client"
import { doc, getDoc } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"

// entities
import { firebaseFirestore } from "@/entities/Region"
import {
  // types
  IUserOfDB,

  // const
  USER_ROLE,
  USERS_DB_COLLECTION_NAME,

  // api - mappers
  mapUserDataFromApi,
} from "@/entities/User"
import {
  // types
  INotification,

  // store
  NotificationsStore,
} from "@/entities/Notification"


// shared
import { SOCKET_SERVER_PATH, SOCKET_SERVER_URL } from "@/shared/const"
import { notificationAudioPlay } from "@/shared/lib/audio"
import { TFixMeInTheFuture } from "@/shared/types"

let socket: TFixMeInTheFuture

const socketAsyncInitializer = async () => {
  const currentUser = await getCurrentUser()
  if (currentUser) await socketInitializer(currentUser)
}

const getUserFromDB = async (userUid: string): Promise<IUserOfDB | null> => new Promise(async (resolve, reject) => {
  const userRef = await doc(firebaseFirestore, USERS_DB_COLLECTION_NAME, userUid)
  const docSnap = await getDoc(userRef)

  if (docSnap.exists()) {
    const userDecode = {...docSnap.data()}

    resolve(userDecode?.id ? mapUserDataFromApi(userDecode) : null)
  } else {
    console.warn("getUserFromDB - Not found a users!")
    reject(null)
  }
})

const getCurrentUser = async (): Promise<IUserOfDB | null> => {
  const auth = await getAuth()

  const getUserUidPromise = new Promise(async (resolve, reject) => {
    await onAuthStateChanged(auth, (user: any) => {
      if (user) {
        resolve(user)
      } else {
        console.warn('getUserUidPromise -> onAuthStateChanged - users is signed out')
        reject(null)
      }
    })
  })

  return getUserUidPromise.then(async (user: any) => {
    if (user && user?.uid !== null) {
      const currentUser = await getUserFromDB(user.uid)
      return currentUser
    }

    return null
  }).catch(() => null)
}

const socketInitializer = async (currentUser: IUserOfDB) => {
  socket = io(SOCKET_SERVER_URL, {
    path: SOCKET_SERVER_PATH,
    query: {
      userId: currentUser.id
    }
  })

  socket.on('connect', () => {
    console.log(`connected, socket.id ${socket.id}`)
    socket.emit('connect users', {
      socketId: socket.id,
      userId: currentUser.id
    })
  })

  socket.on("disconnect", () => {
    console.log('disconnect socket.id', socket.id) // undefined
  })

  if (currentUser.role === USER_ROLE.MANAGER) socket.on('newUser', (notifications: Array<INotification>) => {
    console.log({ notifications })
    notificationAudioPlay()

    const currentNotification = notifications.find((notification) => notification.userId === currentUser.id)
    if (!currentNotification) {
      console.warn('ws notification for current users not found')
      return
    }
    const newUserNotification = {
      id: currentNotification.id,
      userId: currentNotification.userId,
      title: currentNotification.title,
      content: currentNotification.content,
      isViewed: currentNotification.isViewed,
    }
    console.log('newUserNotification', { ...newUserNotification })
    NotificationsStore.add(newUserNotification)
  })
}
