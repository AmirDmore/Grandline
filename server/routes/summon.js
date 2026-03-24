const router = require('express').Router()
const pool = require('../db')
const auth = require('../middleware/auth')
const { updateTask } = require('./battle')

function rollRarity(rates, pityCount) {
  const r = Math.random() * 100
  // Pity system: guaranteed legendary at 50 pulls
  if (pityCount >= 50) return 'legendary'
  if (pityCount >= 40 && r < 50) return 'legendary'

  let cumulative = 0
  for (const [rarity, rate] of Object.entries(rates)) {
    cumulative += rate
    if (r < cumulative) return rarity
  }
  return 'rare'
}

router.get('/banners', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM summon_banners WHERE is_active=true ORDER BY id')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/pull/:bannerId', auth, async (req, res) => {
  try {
    const { bannerId } = req.params
    const { count = 1 } = req.body // 1 or 10

    const bannerResult = await pool.query('SELECT * FROM summon_banners WHERE id=$1 AND is_active=true', [bannerId])
    if (!bannerResult.rows.length) return res.status(404).json({ error: 'Banner not found' })
    const banner = bannerResult.rows[0]

    const playerResult = await pool.query('SELECT * FROM players WHERE id=$1', [req.user.playerId])
    const player = playerResult.rows[0]

    const pullCount = Math.min(count, 10)
    const totalTickets = banner.cost_tickets * pullCount
    const totalGems = banner.cost_gems * pullCount

    if (banner.cost_tickets > 0 && player.tickets < totalTickets) {
      return res.status(400).json({ error: `Need ${totalTickets} tickets (have ${player.tickets})` })
    }
    if (banner.cost_gems > 0 && player.gems < totalGems) {
      return res.status(400).json({ error: `Need ${totalGems} gems (have ${player.gems})` })
    }

    // Get pity
    let pityResult = await pool.query('SELECT * FROM player_pity WHERE player_id=$1 AND banner_id=$2', [req.user.playerId, bannerId])
    let pity = pityResult.rows[0] || { pull_count: 0, last_legendary: 0 }

    // Deduct cost
    if (banner.cost_tickets > 0) await pool.query('UPDATE players SET tickets=tickets-$1 WHERE id=$2', [totalTickets, req.user.playerId])
    if (banner.cost_gems > 0) await pool.query('UPDATE players SET gems=gems-$1 WHERE id=$2', [totalGems, req.user.playerId])

    const results = []
    const rates = banner.rates || { mythic: 0.5, legendary: 3, epic: 15, rare: 35, common: 46.5 }
    const featuredHeroes = banner.featured_heroes || []

    for (let i = 0; i < pullCount; i++) {
      pity.pull_count++
      const rarity = rollRarity(rates, pity.pull_count - pity.last_legendary)

      if (rarity === 'legendary' || rarity === 'mythic') {
        pity.last_legendary = pity.pull_count
      }

      // Pick hero of this rarity
      let heroQuery
      if (featuredHeroes.length > 0 && (rarity === 'legendary' || rarity === 'mythic') && Math.random() < 0.5) {
        heroQuery = await pool.query(
          'SELECT * FROM hero_templates WHERE hero_id = ANY($1) ORDER BY RANDOM() LIMIT 1',
          [featuredHeroes]
        )
      }
      if (!heroQuery || !heroQuery.rows.length) {
        heroQuery = await pool.query(
          'SELECT * FROM hero_templates WHERE rarity=$1 ORDER BY RANDOM() LIMIT 1',
          [rarity]
        )
      }
      if (!heroQuery.rows.length) {
        heroQuery = await pool.query('SELECT * FROM hero_templates ORDER BY RANDOM() LIMIT 1')
      }

      const heroTemplate = heroQuery.rows[0]

      // Check if player already has this hero
      const existing = await pool.query(
        'SELECT * FROM player_heroes WHERE player_id=$1 AND hero_template_id=$2',
        [req.user.playerId, heroTemplate.id]
      )

      if (existing.rows.length > 0) {
        // Add shards instead
        const shards = { mythic: 30, legendary: 20, epic: 10, rare: 5, common: 2 }[rarity] || 5
        await pool.query('UPDATE player_heroes SET shards=shards+$1 WHERE player_id=$2 AND hero_template_id=$3',
          [shards, req.user.playerId, heroTemplate.id])
        results.push({ ...heroTemplate, is_duplicate: true, shards_gained: shards })
      } else {
        // Add hero to collection
        await pool.query(
          'INSERT INTO player_heroes (player_id, hero_template_id, level, star_level) VALUES ($1,$2,1,1)',
          [req.user.playerId, heroTemplate.id]
        )
        results.push({ ...heroTemplate, is_duplicate: false, is_new: true })
      }
    }

    // Update pity
    await pool.query(`
      INSERT INTO player_pity (player_id, banner_id, pull_count, last_legendary)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (player_id, banner_id) DO UPDATE SET pull_count=$3, last_legendary=$4
    `, [req.user.playerId, bannerId, pity.pull_count, pity.last_legendary])

    await updateTask(req.user.playerId, 'summon')

    res.json({ results, pity_count: pity.pull_count - pity.last_legendary })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
