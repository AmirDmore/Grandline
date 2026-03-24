const router = require('express').Router()
const pool = require('../db')
const auth = require('../middleware/auth')

// Get current player profile
router.get('/me', auth, async (req, res) => {
  try {
    const player = await pool.query('SELECT * FROM players WHERE id=$1', [req.user.playerId])
    if (!player.rows.length) return res.status(404).json({ error: 'Player not found' })
    res.json(player.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update player class
router.put('/class', auth, async (req, res) => {
  try {
    const { class: playerClass } = req.body
    const validClasses = ['Fighter', 'Swordsman', 'Magician', 'Archer', 'Summoner']
    if (!validClasses.includes(playerClass)) return res.status(400).json({ error: 'Invalid class' })
    const result = await pool.query('UPDATE players SET class=$1 WHERE id=$2 RETURNING *', [playerClass, req.user.playerId])
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get player stats summary
router.get('/stats', auth, async (req, res) => {
  try {
    const player = await pool.query('SELECT * FROM players WHERE id=$1', [req.user.playerId])
    const heroCount = await pool.query('SELECT COUNT(*) FROM player_heroes WHERE player_id=$1', [req.user.playerId])
    const stageCount = await pool.query('SELECT COUNT(*) FROM player_progress WHERE player_id=$1 AND completed=true', [req.user.playerId])
    const p = player.rows[0]
    res.json({
      ...p,
      hero_count: parseInt(heroCount.rows[0].count),
      stages_cleared: parseInt(stageCount.rows[0].count)
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Vitality regen check
router.post('/regen', auth, async (req, res) => {
  try {
    const player = await pool.query('SELECT * FROM players WHERE id=$1', [req.user.playerId])
    const p = player.rows[0]
    const now = new Date()
    const regenAt = new Date(p.vitality_regen_at)
    const minutesPassed = Math.floor((now - regenAt) / 60000)
    const regenAmount = Math.min(minutesPassed, p.max_vitality - p.vitality)
    if (regenAmount > 0) {
      const newVitality = Math.min(p.vitality + regenAmount, p.max_vitality)
      const newRegenAt = new Date(regenAt.getTime() + regenAmount * 60000)
      await pool.query('UPDATE players SET vitality=$1, vitality_regen_at=$2 WHERE id=$3', [newVitality, newRegenAt, p.id])
      res.json({ vitality: newVitality, max_vitality: p.max_vitality })
    } else {
      res.json({ vitality: p.vitality, max_vitality: p.max_vitality })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
