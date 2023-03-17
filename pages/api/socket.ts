import { Server } from 'Socket.IO'
import type { Server as IOServer } from 'Socket.IO'
import type { Server as HTTPServer } from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket as NetSocket } from 'net'
import { createNotification } from '@/lib/ssr/requests/notifications/createNotification'
import { getAllManagers } from '@/lib/ssr/requests/getUsers'
import { UserOfDB } from "@/stores/userStore"
import { Notification } from '@/stores/notificationsStore'

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  // let io
  if (res.socket.server.io) {
    console.log('Socket is already running')
    // io = res.socket.server.io
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      console.log('socket id', socket.id)
      // socket.broadcast.emit("user connected", {
      //   userID: socket.id,
      //   username: socket.username,
      // })

      socket.on('disconnect', () => {
        console.log('user disconnected')
      })

      socket.on('connect user', async ({ socketId, userId }) => {
        /* TODO: then user was connected to ws - we need to add him to our WS onlineUsersList */
      })

      // setTimeout(async () => {
      //   console.log('new user timeout')
      //   const msg = 'test notification text.'
      //   const notifications = await createNotificationsForAllManagers(msg)
      //   await socket.broadcast.emit('newUser', [...notifications])
      // }, 1000)

      socket.on('newUser', async (msg) => {
        /* TODO: on newUser event: we need ???? */
        console.log('next.js newUser', msg)
        const notifications = await createNotificationsForAllManagers(msg)

        /*
        * we need to send a private notification to every manager on the network.
        * To do this, we need to know that he is online, his connection ID(socket.id), and information about him(client id).
        * */
        await socket.broadcast.emit('newUser', [...notifications])
      })
    })

    /* TODO: we create disconnect event  */
    /* TODO: on disconnect event we need rm user from our onlineUsersList */
  }

  res.end()
}

async function createNotificationsForAllManagers (msg: string): Promise<Array<Notification>> {
  const allManagers: Array<UserOfDB> = await getAllManagers()
  const allManagesIds: Array<string> = await allManagers.map((manager: UserOfDB) => manager.id)

  const promises = await allManagesIds.map((managerId) => {
    return new Promise(async (resolve, reject) => {
      const notification = await createNotification({
        recipientUserId: managerId,
        text: msg
      })
      if (notification !== null) resolve(notification)
      else reject(notification)
    })
  })
  const createdNotificationsRes = await Promise.allSettled(promises)

  const notifications: Array<Notification> = await createdNotificationsRes.filter((notificationPromiseRes) => {
    return notificationPromiseRes.status !== "rejected"
    // @ts-ignore
  }).map(notificationPromiseRes => notificationPromiseRes?.value)

  return notifications
}

export default SocketHandler
