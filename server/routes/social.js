const router = require('express').Router()
const pool = require('../db')
const auth = require('../middleware/auth')

// Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.name, p.class, p.level, p.power, p.wins, p.total_battles,
             COUNT(ph.id) as hero_count
      FROM players p
      LEFT JOIN player_heroes ph ON ph.player_id = p.id
      GROUP BY p.id
      ORDER BY p.level DESC, p.wins DESC
      LIMIT 50
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get friends list
router.get('/friends', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.*, p.name, p.class, p.level, p.power
      FROM friendships f
      JOIN players p ON p.id = f.friend_id
      WHERE f.player_id = $1
      ORDER BY f.status, p.name
    `, [req.user.playerId])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Send friend request
router.post('/friends/add', auth, async (req, res) => {
  try {
    const { username } = req.body
    const friendUser = await pool.query('SELECT id FROM users WHERE username=$1', [username])
    if (!friendUser.rows.length) return res.status(404).json({ error: 'Player not found' })
    const friendPlayer = await pool.query('SELECT id FROM players WHERE user_id=$1', [friendUser.rows[0].id])
    if (!friendPlayer.rows.length) return res.status(404).json({ error: 'Player not found' })
    const friendId = friendPlayer.rows[0].id
    if (friendId === req.user.playerId) return res.status(400).json({ error: 'Cannot add yourself' })

    await pool.query(`
      INSERT INTO friendships (player_id, friend_id, status) VALUES ($1,$2,'accepted')
      ON CONFLICT DO NOTHING
    `, [req.user.playerId, friendId])
    await pool.query(`
      INSERT INTO friendships (player_id, friend_id, status) VALUES ($1,$2,'accepted')
      ON CONFLICT DO NOTHING
    `, [friendId, req.user.playerId])

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
