import { Router } from 'express'
import { pool } from '../db/postgres.js'

const router = Router()

// Every stage, in pipeline order, with how many tickets it has.
// The extra counts feed the small note on each home card; which one a card
// shows is picked by stages.summary_metric.
router.get('/', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT s.id, s.key, s.name, s.color, s.icon, s.summary_metric,
      count(t.id)::int AS count,
      count(t.id) FILTER (WHERE t.created_at >= now() - interval '7 days')::int AS new_this_week,
      count(t.id) FILTER (WHERE t.waiting_on_customer)::int AS waiting,
      count(t.id) FILTER (WHERE t.due_date BETWEEN current_date AND current_date + 7)::int AS due_this_week,
      count(t.id) FILTER (WHERE t.completed_at >= date_trunc('month', now()))::int AS done_this_month
    FROM stages s
    LEFT JOIN tickets t ON t.stage_id = s.id
    GROUP BY s.id
    ORDER BY s.position
  `)
  res.json(rows)
})

export default router
