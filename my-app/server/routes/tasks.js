import { Router } from 'express'
import { pool } from '../db/postgres.js'
import { CURRENT_USER_ID } from '../currentUser.js'

const router = Router()

// Tasks plus the stage of the ticket they're linked to (for the coloured tag)
const SELECT_TASKS = `
  SELECT t.id, t.title, t.done, s.name AS stage_name, s.color AS stage_color
  FROM tasks t
  LEFT JOIN tickets tk ON tk.id = t.ticket_id
  LEFT JOIN stages s ON s.id = tk.stage_id
  WHERE t.user_id = $1
`

router.get('/', async (req, res) => {
  const { rows } = await pool.query(`${SELECT_TASKS} ORDER BY t.done, t.created_at`, [CURRENT_USER_ID])
  res.json(rows)
})

router.post('/', async (req, res) => {
  const title = req.body.title?.trim()
  if (!title) return res.status(400).json({ error: 'Title is required' })

  await pool.query('INSERT INTO tasks (user_id, title) VALUES ($1, $2)', [CURRENT_USER_ID, title])
  res.status(201).end()
})

router.patch('/:id', async (req, res) => {
  await pool.query(
    'UPDATE tasks SET done = $1 WHERE id = $2 AND user_id = $3',
    [Boolean(req.body.done), req.params.id, CURRENT_USER_ID],
  )
  res.status(204).end()
})

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [req.params.id, CURRENT_USER_ID])
  res.status(204).end()
})

export default router
