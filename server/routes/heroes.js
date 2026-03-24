const router = require('express').Router()
const pool = require('../db')
const auth = require('../middleware/auth')

// Get all hero templates (gacha pool)
router.get('/templates', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hero_templates ORDER BY rarity DESC, name ASC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get player's crew (collected heroes)
router.get('/crew', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ph.*, ht.name, ht.title, ht.faction, ht.rarity, ht.class, ht.arc,
             ht.portrait_big, ht.portrait_small, ht.base_hp, ht.base_patk, ht.base_catk,
             ht.base_matk, ht.base_pdef, ht.base_cdef, ht.base_mdef, ht.base_speed,
             ht.skill_name, ht.skill_desc, ht.rage_name, ht.rage_desc, ht.lore
      FROM player_heroes ph
      JOIN hero_templates ht ON ph.hero_template_id = ht.id
      WHERE ph.player_id = $1
      ORDER BY ht.rarity DESC, ph.star_level DESC, ph.level DESC
    `, [req.user.playerId])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get formation (heroes in battle slots)
router.get('/formation', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ph.*, ht.name, ht.title, ht.faction, ht.rarity, ht.class,
             ht.portrait_big, ht.portrait_small, ht.base_hp, ht.base_patk, ht.base_catk,
             ht.base_matk, ht.base_pdef, ht.base_cdef, ht.base_mdef, ht.base_speed,
             ht.skill_name, ht.skill_desc, ht.rage_name, ht.rage_desc
      FROM player_heroes ph
      JOIN hero_templates ht ON ph.hero_template_id = ht.id
      WHERE ph.player_id = $1 AND ph.is_in_formation = true
      ORDER BY ph.formation_slot ASC
    `, [req.user.playerId])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update formation
router.put('/formation', auth, async (req, res) => {
  try {
    const { slots } = req.body // array of { hero_id, slot }
    // Clear current formation
    await pool.query('UPDATE player_heroes SET is_in_formation=false, formation_slot=NULL WHERE player_id=$1', [req.user.playerId])
    // Set new formation
    for (const slot of slots) {
      if (slot.hero_id && slot.slot >= 1 && slot.slot <= 5) {
        await pool.query(
          'UPDATE player_heroes SET is_in_formation=true, formation_slot=$1 WHERE id=$2 AND player_id=$3',
          [slot.slot, slot.hero_id, req.user.playerId]
        )
      }
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Level up a hero
router.post('/levelup/:heroId', auth, async (req, res) => {
  try {
    const { heroId } = req.params
    const heroResult = await pool.query(
      'SELECT ph.*, ht.base_hp FROM player_heroes ph JOIN hero_templates ht ON ph.hero_template_id=ht.id WHERE ph.id=$1 AND ph.player_id=$2',
      [heroId, req.user.playerId]
    )
    if (!heroResult.rows.length) return res.status(404).json({ error: 'Hero not found' })
    const hero = heroResult.rows[0]
    if (hero.level >= 100) return res.status(400).json({ error: 'Hero is at max level' })

    const goldCost = hero.level * 500
    const player = await pool.query('SELECT gold FROM players WHERE id=$1', [req.user.playerId])
    if (player.rows[0].gold < goldCost) return res.status(400).json({ error: 'Not enough gold' })

    await pool.query('UPDATE players SET gold=gold-$1 WHERE id=$2', [goldCost, req.user.playerId])
    const updated = await pool.query('UPDATE player_heroes SET level=level+1 WHERE id=$1 RETURNING *', [heroId])
    res.json({ hero: updated.rows[0], gold_spent: goldCost })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Star up a hero (requires shards)
router.post('/starup/:heroId', auth, async (req, res) => {
  try {
    const { heroId } = req.params
    const heroResult = await pool.query('SELECT * FROM player_heroes WHERE id=$1 AND player_id=$2', [heroId, req.user.playerId])
    if (!heroResult.rows.length) return res.status(404).json({ error: 'Hero not found' })
    const hero = heroResult.rows[0]
    if (hero.star_level >= 6) return res.status(400).json({ error: 'Hero is at max star level' })

    const shardsNeeded = [0, 20, 40, 60, 80, 100][hero.star_level]
    if (hero.shards < shardsNeeded) return res.status(400).json({ error: `Need ${shardsNeeded} shards (have ${hero.shards})` })

    const updated = await pool.query(
      'UPDATE player_heroes SET star_level=star_level+1, shards=shards-$1 WHERE id=$2 RETURNING *',
      [shardsNeeded, heroId]
    )
    res.json(updated.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
