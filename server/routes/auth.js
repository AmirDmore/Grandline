const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../db')

const JWT_SECRET = process.env.JWT_SECRET || 'grandline_secret_key_2024'
const ALLOWED_USERS = (process.env.ALLOWED_USERS || '').split(',').map(u => u.trim().toLowerCase()).filter(Boolean)

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' })
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

    // Check allowed users list (if set)
    if (ALLOWED_USERS.length > 0 && !ALLOWED_USERS.includes(username.toLowerCase()) && !ALLOWED_USERS.includes(email.toLowerCase())) {
      return res.status(403).json({ error: 'This game is private. Contact the admin for access.' })
    }

    const existing = await pool.query('SELECT id FROM users WHERE username=$1 OR email=$2', [username, email])
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Username or email already taken' })

    const hash = await bcrypt.hash(password, 10)
    const userResult = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1,$2,$3) RETURNING id, username, email, is_admin',
      [username, email, hash]
    )
    const user = userResult.rows[0]

    // Create player profile
    const playerResult = await pool.query(
      'INSERT INTO players (user_id, name, class) VALUES ($1,$2,$3) RETURNING *',
      [user.id, username, 'Fighter']
    )
    const player = playerResult.rows[0]

    // Give starter ship (Going Merry)
    const shipTemplate = await pool.query('SELECT id FROM ship_templates WHERE name=$1', ['Going Merry'])
    if (shipTemplate.rows.length > 0) {
      await pool.query('INSERT INTO player_ships (player_id, ship_template_id, is_active) VALUES ($1,$2,true)', [player.id, shipTemplate.rows[0].id])
    }

    // Give starter hero (Luffy)
    const luffyTemplate = await pool.query('SELECT id FROM hero_templates WHERE hero_id=$1', ['10007'])
    if (luffyTemplate.rows.length > 0) {
      await pool.query('INSERT INTO player_heroes (player_id, hero_template_id, level, star_level, is_in_formation, formation_slot) VALUES ($1,$2,1,1,true,1)', [player.id, luffyTemplate.rows[0].id])
    }

    // Send welcome mail
    await pool.query(`
      INSERT INTO player_mail (player_id, sender, subject, body, attachments)
      VALUES ($1,'System','Welcome to The Grand Line!',
        'Welcome, brave pirate! Your adventure begins now. You have been given Luffy as your starter hero and the Going Merry as your ship. Set sail for the Grand Line!',
        $2)
    `, [player.id, JSON.stringify({ gold: 5000, gems: 100, tickets: 10 })])

    const token = jwt.sign({ userId: user.id, playerId: player.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, is_admin: user.is_admin }, player })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const userResult = await pool.query('SELECT * FROM users WHERE username=$1 OR email=$1', [username])
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' })
    const user = userResult.rows[0]

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    await pool.query('UPDATE users SET last_login=NOW() WHERE id=$1', [user.id])

    const playerResult = await pool.query('SELECT * FROM players WHERE user_id=$1', [user.id])
    const player = playerResult.rows[0]

    const token = jwt.sign({ userId: user.id, playerId: player.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, is_admin: user.is_admin }, player })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})

module.exports = router
