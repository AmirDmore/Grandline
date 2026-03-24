require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

app.use(cors())
app.use(express.json())

// Serve game assets (portraits, backgrounds, etc.)
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

// API Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/player', require('./routes/player'))
app.use('/api/heroes', require('./routes/heroes'))
app.use('/api/campaign', require('./routes/campaign'))
app.use('/api/battle', require('./routes/battle'))
app.use('/api/summon', require('./routes/summon'))
app.use('/api/ships', require('./routes/ships'))
app.use('/api/tasks', require('./routes/tasks'))
app.use('/api/mail', require('./routes/mail'))
app.use('/api/social', require('./routes/social'))
app.use('/api/admin', require('./routes/admin'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', game: 'The Grand Line' }))

// Socket.IO for real-time multiplayer
require('./socket')(io)

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`🏴‍☠️ The Grand Line server running on port ${PORT}`)
})
