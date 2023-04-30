import React, {
  useEffect,
} from "react"
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { io } from "socket.io-client"

// utils
import { SOCKET_SERVER_PATH, SOCKET_SERVER_URL } from "@/lib/const"
import { firebaseFirestore } from "@/lib/firebase"
import { notificationAudioPlay } from "@/lib/audio"
import { fixMeInTheFuture } from "@/lib/types"

// stores
import { USER_ROLE, UserOfDB, USERS_DB_COLLECTION_NAME } from "@/stores/userStore"
import NotificationsStore, { Notification } from "@/stores/notificationsStore"

export type NotificationProps = {
  children: any
}

let socket: fixMeInTheFuture

export function NotificationProvider({ children }: NotificationProps) {
  useEffect(() => {
    socketAsyncInitializer()

    return () => {
      console.log('NotificationProvider unmount')
    }
  }, [])

  const socketAsyncInitializer = async () => {
    const currentUser = await getCurrentUser()
    if (currentUser) await socketInitializer(currentUser)
  }

  const getUserFromDB = async (userUid: string): Promise<UserOfDB | null> => new Promise(async (resolve, reject) => {
    const userRef = await doc(firebaseFirestore, USERS_DB_COLLECTION_NAME, userUid)
    const docSnap = await getDoc(userRef)

    if (docSnap.exists()) {
      const userDecode = {...docSnap.data()}

      resolve({
        id: docSnap.id,
        name: userDecode.name,
        phone: userDecode.phone,
        email: userDecode.email,
        city: userDecode.city,
        role: userDecode.role,
        userCodeId: userDecode.userCodeId,
      })
    } else {
      console.warn("getUserFromDB - Not found a user!")
      reject(null)
    }
  })

  const getCurrentUser = async (): Promise<UserOfDB | null> => {
    const auth = await getAuth()

    const getUserUidPromise = new Promise(async (resolve, reject) => {
      await onAuthStateChanged(auth, (user: any) => {
        if (user) {
          resolve(user)
        } else {
          console.warn('getUserUidPromise -> onAuthStateChanged - user is signed out')
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

  const socketInitializer = async (currentUser: UserOfDB) => {
    socket = io(SOCKET_SERVER_URL, {
      path: SOCKET_SERVER_PATH,
      query: {
        userId: currentUser.id
      }
    })

    socket.on('connect', () => {
      console.log(`connected, socket.id ${socket.id}`)
      socket.emit('connect user', {
        socketId: socket.id,
        userId: currentUser.id
      })
    })

    socket.on("disconnect", () => {
      console.log('disconnect socket.id', socket.id) // undefined
    })

    if (currentUser.role === USER_ROLE.MANAGER) socket.on('newUser', (notifications: Array<Notification>) => {
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
    <>{children}</>
  )
}
