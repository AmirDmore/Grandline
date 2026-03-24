const router = require('express').Router()
const pool = require('../db')
const auth = require('../middleware/auth')

// Calculate hero stats with level/star scaling
function calcStats(hero) {
  const lvMult = 1 + (hero.level - 1) * 0.08
  const starMult = 1 + (hero.star_level - 1) * 0.15
  const mult = lvMult * starMult
  return {
    id: hero.id,
    name: hero.name,
    portrait: hero.portrait_big || hero.portrait_small,
    hp: Math.floor((hero.base_hp || 3000) * mult),
    maxHp: Math.floor((hero.base_hp || 3000) * mult),
    patk: Math.floor((hero.base_patk || 300) * mult),
    catk: Math.floor((hero.base_catk || 200) * mult),
    matk: Math.floor((hero.base_matk || 250) * mult),
    pdef: Math.floor((hero.base_pdef || 200) * mult),
    cdef: Math.floor((hero.base_cdef || 180) * mult),
    mdef: Math.floor((hero.base_mdef || 200) * mult),
    speed: hero.base_speed || 100,
    skill_name: hero.skill_name,
    skill_desc: hero.skill_desc,
    rage_name: hero.rage_name,
    rage_desc: hero.rage_desc,
    rage: 0,
    maxRage: 100,
    class: hero.class,
    rarity: hero.rarity,
    buffs: [],
    debuffs: [],
    isAlive: true,
    faction: hero.faction
  }
}

function calcEnemyStats(enemy, powerScale) {
  const scale = powerScale || 1
  return {
    id: enemy.id || `e_${Math.random()}`,
    name: enemy.name,
    portrait: enemy.portrait || '/assets/bitmaps/heroHeads/headsmall/samll_10033.png',
    hp: Math.floor((enemy.hp || 2000) * scale),
    maxHp: Math.floor((enemy.hp || 2000) * scale),
    patk: Math.floor((enemy.atk || 200) * scale),
    catk: Math.floor((enemy.atk || 150) * scale),
    matk: Math.floor((enemy.atk || 180) * scale),
    pdef: Math.floor((enemy.def || 150) * scale),
    cdef: Math.floor((enemy.def || 120) * scale),
    mdef: Math.floor((enemy.def || 130) * scale),
    speed: enemy.speed || 90,
    skill_name: 'Attack',
    rage: 0,
    maxRage: 100,
    class: 'Fighter',
    rarity: 'common',
    buffs: [],
    debuffs: [],
    isAlive: true,
    isEnemy: true
  }
}

// Simulate a full battle and return the log
function simulateBattle(playerTeam, enemyTeam) {
  const log = []
  let turn = 0
  const maxTurns = 30

  // Combine all units sorted by speed
  const allUnits = [
    ...playerTeam.map(u => ({ ...u, isPlayer: true })),
    ...enemyTeam.map(u => ({ ...u, isPlayer: false }))
  ]

  while (turn < maxTurns) {
    turn++
    const alive = allUnits.filter(u => u.isAlive)
    const playerAlive = alive.filter(u => u.isPlayer)
    const enemyAlive = alive.filter(u => !u.isPlayer)

    if (playerAlive.length === 0 || enemyAlive.length === 0) break

    // Sort by speed for turn order
    const turnOrder = alive.sort((a, b) => b.speed - a.speed)

    log.push({ type: 'turn_start', turn, message: `--- Turn ${turn} ---` })

    for (const attacker of turnOrder) {
      if (!attacker.isAlive) continue
      const targets = attacker.isPlayer ? allUnits.filter(u => !u.isPlayer && u.isAlive) : allUnits.filter(u => u.isPlayer && u.isAlive)
      if (targets.length === 0) break

      // Process debuffs (burn, bleed, poison)
      for (const debuff of attacker.debuffs) {
        if (debuff.type === 'burn' || debuff.type === 'bleed') {
          attacker.hp = Math.max(0, attacker.hp - debuff.damage)
          log.push({ type: 'debuff', unit: attacker.name, debuff: debuff.type, damage: debuff.damage, hp: attacker.hp })
          debuff.turns--
        }
      }
      attacker.debuffs = attacker.debuffs.filter(d => d.turns > 0)
      if (attacker.hp <= 0) { attacker.isAlive = false; continue }

      // Gain rage
      attacker.rage = Math.min(attacker.maxRage, attacker.rage + 20)

      // Choose action: rage skill if full, else normal skill or basic attack
      let action = 'attack'
      if (attacker.rage >= 100) action = 'rage'
      else if (Math.random() < 0.4) action = 'skill'

      const target = targets[Math.floor(Math.random() * targets.length)]
      let damage = 0
      let actionName = ''
      let isAoe = false

      if (action === 'rage') {
        attacker.rage = 0
        const atkStat = attacker.class === 'Magician' ? attacker.matk : attacker.patk
        damage = Math.floor(atkStat * (4.5 + Math.random() * 1.5))
        const def = attacker.class === 'Magician' ? target.mdef : target.pdef
        damage = Math.max(1, damage - Math.floor(def * 0.3))
        actionName = attacker.rage_name || 'Rage Attack'
        // AOE for rage
        isAoe = true
        const aoeTargets = targets.slice(0, Math.min(3, targets.length))
        for (const t of aoeTargets) {
          const d = Math.max(1, damage - Math.floor(Math.random() * damage * 0.2))
          t.hp = Math.max(0, t.hp - d)
          if (t.hp <= 0) t.isAlive = false
        }
        log.push({
          type: 'rage', attacker: attacker.name, action: actionName,
          targets: aoeTargets.map(t => ({ name: t.name, damage, hp: t.hp, alive: t.isAlive })),
          portrait: attacker.portrait
        })
      } else if (action === 'skill') {
        const atkStat = attacker.class === 'Magician' ? attacker.matk : attacker.patk
        damage = Math.floor(atkStat * (2.5 + Math.random() * 1.0))
        const def = attacker.class === 'Magician' ? target.mdef : target.pdef
        damage = Math.max(1, damage - Math.floor(def * 0.5))
        actionName = attacker.skill_name || 'Skill Attack'
        target.hp = Math.max(0, target.hp - damage)
        if (target.hp <= 0) target.isAlive = false
        // Apply debuff chance
        if (Math.random() < 0.3) {
          target.debuffs.push({ type: 'burn', damage: Math.floor(damage * 0.1), turns: 3 })
        }
        log.push({
          type: 'skill', attacker: attacker.name, action: actionName,
          target: target.name, damage, hp: target.hp, alive: target.isAlive,
          portrait: attacker.portrait
        })
      } else {
        // Basic attack
        const atkStat = attacker.patk
        damage = Math.floor(atkStat * (1.0 + Math.random() * 0.5))
        const def = target.pdef
        damage = Math.max(1, damage - Math.floor(def * 0.6))
        actionName = 'Attack'
        target.hp = Math.max(0, target.hp - damage)
        if (target.hp <= 0) target.isAlive = false
        log.push({
          type: 'attack', attacker: attacker.name, action: actionName,
          target: target.name, damage, hp: target.hp, alive: target.isAlive,
          portrait: attacker.portrait
        })
      }

      // Check if all enemies dead
      const remainingEnemies = allUnits.filter(u => !u.isPlayer && u.isAlive)
      const remainingPlayers = allUnits.filter(u => u.isPlayer && u.isAlive)
      if (remainingEnemies.length === 0 || remainingPlayers.length === 0) break
    }

    const playerAliveCheck = allUnits.filter(u => u.isPlayer && u.isAlive)
    const enemyAliveCheck = allUnits.filter(u => !u.isPlayer && u.isAlive)
    if (playerAliveCheck.length === 0 || enemyAliveCheck.length === 0) break
  }

  const playerAlive = allUnits.filter(u => u.isPlayer && u.isAlive)
  const result = playerAlive.length > 0 ? 'win' : 'lose'
  const stars = result === 'win' ? (turn <= 5 ? 3 : turn <= 15 ? 2 : 1) : 0

  return { result, stars, turns: turn, log, survivors: playerAlive.length }
}

// Start a campaign battle
router.post('/campaign/:stageId', auth, async (req, res) => {
  try {
    const { stageId } = req.params

    // Get stage data
    const stageResult = await pool.query('SELECT * FROM stages WHERE id=$1', [stageId])
    if (!stageResult.rows.length) return res.status(404).json({ error: 'Stage not found' })
    const stage = stageResult.rows[0]

    // Get player's formation
    const formationResult = await pool.query(`
      SELECT ph.*, ht.name, ht.title, ht.faction, ht.rarity, ht.class,
             ht.portrait_big, ht.portrait_small, ht.base_hp, ht.base_patk, ht.base_catk,
             ht.base_matk, ht.base_pdef, ht.base_cdef, ht.base_mdef, ht.base_speed,
             ht.skill_name, ht.skill_desc, ht.rage_name, ht.rage_desc
      FROM player_heroes ph
      JOIN hero_templates ht ON ph.hero_template_id = ht.id
      WHERE ph.player_id = $1 AND ph.is_in_formation = true
      ORDER BY ph.formation_slot ASC
    `, [req.user.playerId])

    if (!formationResult.rows.length) return res.status(400).json({ error: 'No heroes in formation' })

    // Check vitality
    const playerResult = await pool.query('SELECT * FROM players WHERE id=$1', [req.user.playerId])
    const player = playerResult.rows[0]
    if (player.vitality < stage.stamina_cost) {
      return res.status(400).json({ error: `Not enough vitality (need ${stage.stamina_cost}, have ${player.vitality})` })
    }

    // Build teams
    const playerTeam = formationResult.rows.map(calcStats)
    const enemies = stage.enemy_data || []
    const enemyTeam = enemies.map(e => calcEnemyStats(e, 1))

    // Simulate battle
    const battleResult = simulateBattle(playerTeam, enemyTeam)

    // Deduct vitality
    await pool.query('UPDATE players SET vitality=vitality-$1 WHERE id=$2', [stage.stamina_cost, req.user.playerId])

    // Process rewards if won
    let rewards = {}
    if (battleResult.result === 'win') {
      const stageRewards = stage.rewards || {}
      rewards = {
        gold: stageRewards.gold || 200,
        exp: stageRewards.exp || 150,
        gems: stageRewards.gems || 0,
        tickets: stageRewards.tickets || 0
      }

      // Apply star bonuses
      if (battleResult.stars === 3) {
        rewards.gold = Math.floor(rewards.gold * 1.5)
        rewards.gems += 5
      } else if (battleResult.stars === 2) {
        rewards.gold = Math.floor(rewards.gold * 1.2)
      }

      // Update player resources
      await pool.query(`
        UPDATE players SET
          gold = gold + $1,
          exp = exp + $2,
          gems = gems + $3,
          tickets = tickets + $4,
          total_battles = total_battles + 1,
          wins = wins + 1
        WHERE id = $5
      `, [rewards.gold, rewards.exp, rewards.gems, rewards.tickets, req.user.playerId])

      // Level up check
      const updatedPlayer = await pool.query('SELECT * FROM players WHERE id=$1', [req.user.playerId])
      const p = updatedPlayer.rows[0]
      if (p.exp >= p.exp_to_next) {
        const newLevel = p.level + 1
        const newExpToNext = Math.floor(p.exp_to_next * 1.3)
        await pool.query('UPDATE players SET level=$1, exp=exp-$2, exp_to_next=$3, max_vitality=$4 WHERE id=$5',
          [newLevel, p.exp_to_next, newExpToNext, Math.min(p.max_vitality + 2, 200), req.user.playerId])
        rewards.levelUp = newLevel
      }

      // Save progress
      await pool.query(`
        INSERT INTO player_progress (player_id, stage_id, island_id, completed, stars, completed_at)
        VALUES ($1, $2, $3, true, $4, NOW())
        ON CONFLICT (player_id, stage_id) DO UPDATE SET
          completed=true, stars=GREATEST(player_progress.stars, EXCLUDED.stars), completed_at=NOW()
      `, [req.user.playerId, stageId, stage.island_id, battleResult.stars])

      // Update tasks
      await updateTask(req.user.playerId, 'campaign_clear')
      await updateTask(req.user.playerId, 'win_battles')

    } else {
      await pool.query('UPDATE players SET total_battles=total_battles+1, losses=losses+1 WHERE id=$1', [req.user.playerId])
    }

    // Save battle record
    await pool.query(`
      INSERT INTO battle_records (player_id, battle_type, stage_id, result, turns, rewards, battle_log)
      VALUES ($1, 'campaign', $2, $3, $4, $5, $6)
    `, [req.user.playerId, stageId, battleResult.result, battleResult.turns, JSON.stringify(rewards), JSON.stringify(battleResult.log.slice(0, 50))])

    res.json({
      result: battleResult.result,
      stars: battleResult.stars,
      turns: battleResult.turns,
      rewards,
      log: battleResult.log
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

async function updateTask(playerId, taskType) {
  try {
    const tasks = await pool.query('SELECT * FROM task_templates WHERE task_type=$1', [taskType])
    for (const task of tasks.rows) {
      await pool.query(`
        INSERT INTO player_tasks (player_id, task_template_id, current_count)
        VALUES ($1, $2, 1)
        ON CONFLICT (player_id, task_template_id) DO UPDATE SET
          current_count = LEAST(player_tasks.current_count + 1, $3)
        WHERE NOT player_tasks.claimed
      `, [playerId, task.id, task.target_count])
    }
  } catch {}
}

module.exports = router
module.exports.updateTask = updateTask
