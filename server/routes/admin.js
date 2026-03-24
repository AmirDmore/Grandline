const router = require('express').Router()
const pool = require('../db')
const auth = require('../middleware/auth')

const adminOnly = async (req, res, next) => {
  const user = await pool.query('SELECT is_admin FROM users WHERE id=$1', [req.user.userId])
  if (!user.rows[0]?.is_admin) return res.status(403).json({ error: 'Admin only' })
  next()
}

// Get all players
router.get('/players', auth, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.username, u.email, u.last_login
      FROM players p JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Give resources to a player
router.post('/give/:playerId', auth, adminOnly, async (req, res) => {
  try {
    const { gold, gems, tickets } = req.body
    await pool.query(`
      UPDATE players SET
        gold = gold + $1,
        gems = gems + $2,
        tickets = tickets + $3
      WHERE id = $4
    `, [gold || 0, gems || 0, tickets || 0, req.params.playerId])

    // Send mail notification
    await pool.query(`
      INSERT INTO player_mail (player_id, sender, subject, body, attachments)
      VALUES ($1, 'Admin', 'Gift from the Admin!', 'The admin has sent you a gift. Claim it from your attachments!', $2)
    `, [req.params.playerId, JSON.stringify({ gold: gold || 0, gems: gems || 0, tickets: tickets || 0 })])

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Send global announcement mail
router.post('/announce', auth, adminOnly, async (req, res) => {
  try {
    const { subject, body, gold, gems, tickets } = req.body
    const players = await pool.query('SELECT id FROM players')
    for (const p of players.rows) {
      await pool.query(`
        INSERT INTO player_mail (player_id, sender, subject, body, attachments)
        VALUES ($1, 'System', $2, $3, $4)
      `, [p.id, subject, body, JSON.stringify({ gold: gold || 0, gems: gems || 0, tickets: tickets || 0 })])
    }
    res.json({ success: true, sent_to: players.rows.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Make user admin
router.post('/makeadmin/:userId', auth, adminOnly, async (req, res) => {
  try {
    await pool.query('UPDATE users SET is_admin=true WHERE id=$1', [req.params.userId])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
