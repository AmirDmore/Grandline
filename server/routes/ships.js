const router = require('express').Router()
const pool = require('../db')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ps.*, st.name, st.description, st.image_url, st.arc,
             st.base_hp, st.base_speed, st.base_cannon, st.unlock_condition
      FROM player_ships ps
      JOIN ship_templates st ON ps.ship_template_id = st.id
      WHERE ps.player_id = $1
      ORDER BY ps.is_active DESC, ps.id
    `, [req.user.playerId])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/templates', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ship_templates ORDER BY id')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/activate/:shipId', auth, async (req, res) => {
  try {
    await pool.query('UPDATE player_ships SET is_active=false WHERE player_id=$1', [req.user.playerId])
    await pool.query('UPDATE player_ships SET is_active=true WHERE id=$1 AND player_id=$2', [req.params.shipId, req.user.playerId])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/upgrade/:shipId', auth, async (req, res) => {
  try {
    const { upgrade_type } = req.body // 'sail', 'cannon', 'hull'
    const shipResult = await pool.query('SELECT ps.*, st.name FROM player_ships ps JOIN ship_templates st ON ps.ship_template_id=st.id WHERE ps.id=$1 AND ps.player_id=$2', [req.params.shipId, req.user.playerId])
    if (!shipResult.rows.length) return res.status(404).json({ error: 'Ship not found' })
    const ship = shipResult.rows[0]

    const currentLevel = ship[`${upgrade_type}_level`] || 1
    if (currentLevel >= 10) return res.status(400).json({ error: 'Already at max level' })

    const goldCost = currentLevel * 2000
    const player = await pool.query('SELECT gold FROM players WHERE id=$1', [req.user.playerId])
    if (player.rows[0].gold < goldCost) return res.status(400).json({ error: 'Not enough gold' })

    await pool.query('UPDATE players SET gold=gold-$1 WHERE id=$2', [goldCost, req.user.playerId])
    await pool.query(`UPDATE player_ships SET ${upgrade_type}_level=${upgrade_type}_level+1 WHERE id=$1`, [req.params.shipId])
    res.json({ success: true, gold_spent: goldCost })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
