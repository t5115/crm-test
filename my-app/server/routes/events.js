import { Router } from 'express'
import { pool } from '../db/postgres.js'

const router = Router()

// Events plus the stage of their ticket (for the coloured dot / bar)
const SELECT_EVENTS = `
  SELECT e.id, e.title, e.starts_at, s.name AS stage_name, s.color AS stage_color
  FROM events e
  LEFT JOIN tickets tk ON tk.id = e.ticket_id
  LEFT JOIN stages s ON s.id = tk.stage_id
`

// Events between two dates: /api/events?from=...&to=...
router.get('/', async (req, res) => {
  const { from, to } = req.query
  const { rows } = await pool.query(
    `${SELECT_EVENTS} WHERE e.starts_at >= $1 AND e.starts_at < $2 ORDER BY e.starts_at`,
    [from, to],
  )
  res.json(rows)
})

// The next few events from a date: /api/events/upcoming?from=...
router.get('/upcoming', async (req, res) => {
  const { rows } = await pool.query(
    `${SELECT_EVENTS} WHERE e.starts_at >= $1 ORDER BY e.starts_at LIMIT 3`,
    [req.query.from],
  )
  res.json(rows)
})

export default router
