const router = require('express').Router()
const pool = require('../db')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM player_mail WHERE player_id=$1 AND expires_at > NOW()
      ORDER BY created_at DESC LIMIT 50
    `, [req.user.playerId])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/read/:mailId', auth, async (req, res) => {
  try {
    await pool.query('UPDATE player_mail SET is_read=true WHERE id=$1 AND player_id=$2', [req.params.mailId, req.user.playerId])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/claim/:mailId', auth, async (req, res) => {
  try {
    const mailResult = await pool.query('SELECT * FROM player_mail WHERE id=$1 AND player_id=$2', [req.params.mailId, req.user.playerId])
    if (!mailResult.rows.length) return res.status(404).json({ error: 'Mail not found' })
    const mail = mailResult.rows[0]
    if (mail.is_claimed) return res.status(400).json({ error: 'Already claimed' })

    const attachments = mail.attachments || {}
    if (attachments.gold) await pool.query('UPDATE players SET gold=gold+$1 WHERE id=$2', [attachments.gold, req.user.playerId])
    if (attachments.gems) await pool.query('UPDATE players SET gems=gems+$1 WHERE id=$2', [attachments.gems, req.user.playerId])
    if (attachments.tickets) await pool.query('UPDATE players SET tickets=tickets+$1 WHERE id=$2', [attachments.tickets, req.user.playerId])

    await pool.query('UPDATE player_mail SET is_claimed=true, is_read=true WHERE id=$1', [mail.id])
    res.json({ success: true, claimed: attachments })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/claim-all', auth, async (req, res) => {
  try {
    const mails = await pool.query('SELECT * FROM player_mail WHERE player_id=$1 AND is_claimed=false AND expires_at > NOW()', [req.user.playerId])
    let totalGold = 0, totalGems = 0, totalTickets = 0
    for (const mail of mails.rows) {
      const a = mail.attachments || {}
      totalGold += a.gold || 0
      totalGems += a.gems || 0
      totalTickets += a.tickets || 0
    }
    if (totalGold > 0) await pool.query('UPDATE players SET gold=gold+$1 WHERE id=$2', [totalGold, req.user.playerId])
    if (totalGems > 0) await pool.query('UPDATE players SET gems=gems+$1 WHERE id=$2', [totalGems, req.user.playerId])
    if (totalTickets > 0) await pool.query('UPDATE players SET tickets=tickets+$1 WHERE id=$2', [totalTickets, req.user.playerId])
    await pool.query('UPDATE player_mail SET is_claimed=true, is_read=true WHERE player_id=$1 AND is_claimed=false', [req.user.playerId])
    res.json({ success: true, claimed: { gold: totalGold, gems: totalGems, tickets: totalTickets } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
