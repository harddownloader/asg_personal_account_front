import { Server } from 'Socket.IO'

const SocketHandler = (req, res) => {
  let io
  if (res.socket.server.io) {
    console.log('Socket is already running')
    io = res.socket.server.io
  } else {
    console.log('Socket is initializing')
    io = new Server(res.socket.server)
    res.socket.server.io = io

    // io.on('connection', socket => {
    //   console.log('next.js connection')
    //   socket.on('newUser', msg => {
    //     console.log('next.js newUser', msg)
    //     socket.broadcast.emit('newUser', msg)
    //   })
    // })
  }

  io.on('connection', socket => {
    socket.on('newUser', msg => {
      console.log('next.js newUser', msg)
      socket.broadcast.emit('newUser', msg)
    })

    socket.on('disconnect', () => {
      console.log("socket disconnected")
    })
  })

  res.end()
}

export default SocketHandler
