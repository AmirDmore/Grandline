const router = require('express').Router()
const pool = require('../db')
const auth = require('../middleware/auth')

// Get all islands with player progress
router.get('/islands', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*,
        COUNT(s.id) as total_stages,
        COUNT(pp.id) FILTER (WHERE pp.completed=true) as cleared_stages
      FROM islands i
      LEFT JOIN stages s ON s.island_id = i.id
      LEFT JOIN player_progress pp ON pp.stage_id = s.id AND pp.player_id = $1
      GROUP BY i.id
      ORDER BY i.arc_order, i.island_order
    `, [req.user.playerId])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get stages for an island
router.get('/islands/:islandId/stages', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*,
        pp.completed, pp.stars, pp.best_time
      FROM stages s
      LEFT JOIN player_progress pp ON pp.stage_id = s.id AND pp.player_id = $1
      WHERE s.island_id = $2
      ORDER BY s.stage_number
    `, [req.user.playerId, req.params.islandId])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get player's overall progress
router.get('/progress', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pp.*, s.name as stage_name, i.name as island_name, i.arc
      FROM player_progress pp
      JOIN stages s ON pp.stage_id = s.id
      JOIN islands i ON s.island_id = i.id
      WHERE pp.player_id = $1 AND pp.completed = true
      ORDER BY pp.completed_at DESC
      LIMIT 20
    `, [req.user.playerId])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
