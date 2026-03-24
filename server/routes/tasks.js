const router = require('express').Router()
const pool = require('../db')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    // Initialize tasks for player if not exist
    const templates = await pool.query('SELECT * FROM task_templates')
    for (const t of templates.rows) {
      await pool.query(`
        INSERT INTO player_tasks (player_id, task_template_id, current_count, reset_at)
        VALUES ($1, $2, 0, NOW() + INTERVAL '1 day')
        ON CONFLICT (player_id, task_template_id) DO NOTHING
      `, [req.user.playerId, t.id])
    }

    // Reset expired tasks
    await pool.query(`
      UPDATE player_tasks SET current_count=0, claimed=false, reset_at=NOW() + INTERVAL '1 day'
      WHERE player_id=$1 AND reset_at < NOW()
    `, [req.user.playerId])

    const result = await pool.query(`
      SELECT pt.*, tt.name, tt.description, tt.task_type, tt.target_count,
             tt.reward_gold, tt.reward_gems, tt.reward_tickets, tt.reward_exp, tt.reset_type
      FROM player_tasks pt
      JOIN task_templates tt ON pt.task_template_id = tt.id
      WHERE pt.player_id = $1
      ORDER BY tt.id
    `, [req.user.playerId])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/claim/:taskId', auth, async (req, res) => {
  try {
    const taskResult = await pool.query(`
      SELECT pt.*, tt.target_count, tt.reward_gold, tt.reward_gems, tt.reward_tickets, tt.reward_exp
      FROM player_tasks pt
      JOIN task_templates tt ON pt.task_template_id = tt.id
      WHERE pt.id=$1 AND pt.player_id=$2
    `, [req.params.taskId, req.user.playerId])

    if (!taskResult.rows.length) return res.status(404).json({ error: 'Task not found' })
    const task = taskResult.rows[0]

    if (task.claimed) return res.status(400).json({ error: 'Already claimed' })
    if (task.current_count < task.target_count) return res.status(400).json({ error: 'Task not completed yet' })

    await pool.query('UPDATE player_tasks SET claimed=true WHERE id=$1', [task.id])
    await pool.query(`
      UPDATE players SET
        gold=gold+$1, gems=gems+$2, tickets=tickets+$3, exp=exp+$4
      WHERE id=$5
    `, [task.reward_gold, task.reward_gems, task.reward_tickets, task.reward_exp, req.user.playerId])

    res.json({ success: true, rewards: { gold: task.reward_gold, gems: task.reward_gems, tickets: task.reward_tickets, exp: task.reward_exp } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
