import { Router } from 'express'
import { pool } from '../db/postgres.js'
import { CURRENT_USER_ID } from '../currentUser.js'

const router = Router()

router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [CURRENT_USER_ID])
  res.json(rows[0])
})

router.patch('/', async (req, res) => {
  const { name, email, role } = req.body
  const { rows } = await pool.query(
    'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, name, email, role',
    [name, email, role, CURRENT_USER_ID],
  )
  res.json(rows[0])
})

export default router
