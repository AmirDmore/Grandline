const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'grandline_secret_key_2024'

const onlinePlayers = new Map()

module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error('Authentication required'))
    try {
      socket.user = jwt.verify(token, JWT_SECRET)
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    const { playerId, username } = socket.user
    onlinePlayers.set(playerId, { username, socketId: socket.id })
    console.log(`⚓ ${username} connected (${onlinePlayers.size} online)`)

    // Broadcast online count
    io.emit('online_count', onlinePlayers.size)

    // Chat message
    socket.on('chat_message', (data) => {
      io.emit('chat_message', {
        playerId,
        username,
        message: data.message?.slice(0, 200),
        timestamp: new Date().toISOString()
      })
    })

    // Challenge another player
    socket.on('challenge', (targetPlayerId) => {
      const target = onlinePlayers.get(targetPlayerId)
      if (target) {
        io.to(target.socketId).emit('challenge_received', { from: playerId, fromName: username })
      }
    })

    socket.on('disconnect', () => {
      onlinePlayers.delete(playerId)
      io.emit('online_count', onlinePlayers.size)
      console.log(`⚓ ${username} disconnected`)
    })
  })
}
