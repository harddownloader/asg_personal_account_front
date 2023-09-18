import { Server } from 'socket.io'
import * as Sentry from "@sentry/nextjs"
import type { Server as IOServer } from 'socket.io'
import type { Server as HTTPServer } from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket as NetSocket } from 'net'
import type { IUserOfDB } from "@/entities/User"
import type { INotification } from '@/entities/Notification'
import { UserService } from './users/[[...params]]'
import { API_URI } from '@/shared/const'
import { AUTHORIZATION_HEADER_KEY } from "@/shared/lib/providers/auth"

interface ISocketServer extends HTTPServer {
  io?: IOServer | undefined
}

interface ISocketWithIO extends NetSocket {
  server: ISocketServer
}

interface INextApiResponseWithSocket extends NextApiResponse {
  socket: ISocketWithIO
}

const SocketHandler = (req: NextApiRequest, res: INextApiResponseWithSocket) => {
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
      // socket.broadcast.emit("users connected", {
      //   userID: socket.id,
      //   username: socket.username,
      // })

      socket.on('disconnect', () => {
        console.log('users disconnected')
      })

      socket.on('connect users', async ({ socketId, userId }) => {
        /* TODO: then users was connected to ws - we need to add him to our WS onlineUsersList */
      })

      // setTimeout(async () => {
      //   console.log('new users timeout')
      //   const msg = 'test notification text.'
      //   const notifications = await createNotificationsForAllManagers(msg)
      //   await socket.broadcast.emit('newUser', [...notifications])
      // }, 1000)

      socket.on('newUser', async (msg) => {
        /* TODO: on newUser event: we need ???? */
        console.log('next.js newUser', msg)
        const country = "us"
        const notifications = await createNotificationsForAllManagers(country, msg)

        /*
        * we need to send a private notification to every manager on the network.
        * To do this, we need to know that he is online, his connection ID(socket.id), and information about him(client id).
        * */
        await socket.broadcast.emit('newUser', [...notifications])
      })
    })

    /* TODO: we create disconnect event  */
    /* TODO: on disconnect event we need rm users from our onlineUsersList */
  }

  res.end()
}

async function createNotificationsForAllManagers (country: string, msg: string): Promise<Array<INotification>> {
  // const allManagers: Array<IUserOfDB> = await getAllManagers()
  const allManagers: Array<IUserOfDB> = await new UserService().getAllManagersOfRegion(country)
  const allManagesIds: Array<string> = await allManagers.map((manager: IUserOfDB) => manager.id)

  const promises = await allManagesIds.map((managerId) => {
    return new Promise(async (resolve, reject) => {
      // const notification = await createNotification({
      //   recipientUserId: managerId,
      //   text: msg
      // })

      /*
      *  !!! IT IS WAITING FOR ADDING JWT TOKEN FOR PROTECTION SOCKETS !!!
      * */
      const notification = await fetch(`${API_URI}notifications/`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          // [`${AUTHORIZATION_HEADER_KEY}`]: `Bearer ${accessToken}`
        }),
        credentials: "same-origin",
      })
        .then((res) => res.json())
        .catch((error) => {
          console.error('creation of new notification failed', error)
          Sentry.captureException(error)

          return null
        })

      if (notification !== null) resolve(notification)
      else reject(notification)
    })
  })
  const createdNotificationsRes = await Promise.allSettled(promises)

  const notifications: Array<INotification> = await createdNotificationsRes.filter((notificationPromiseRes) => {
    return notificationPromiseRes.status !== "rejected"
    // @ts-ignore
  }).map(notificationPromiseRes => notificationPromiseRes?.value)

  return notifications
}

export default SocketHandler
