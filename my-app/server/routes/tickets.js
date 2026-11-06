import { Router } from 'express'
import { pool } from '../db/postgres.js'

const router = Router()

// Create a new lead. It always goes into the first stage of the pipeline.
// If a customer name is given, a customer row is created for it too.
router.post('/', async (req, res) => {
  const title = req.body.title?.trim()
  const customerName = req.body.customerName?.trim() ?? ''
  if (!title) return res.status(400).json({ error: 'Title is required' })

  const { rows } = await pool.query(`
    WITH new_customer AS (
      INSERT INTO customers (name) SELECT $2::text WHERE $2::text <> '' RETURNING id
    )
    INSERT INTO tickets (title, customer_id, stage_id)
    VALUES ($1, (SELECT id FROM new_customer), (SELECT id FROM stages ORDER BY position LIMIT 1))
    RETURNING *
  `, [title, customerName])

  res.status(201).json(rows[0])
})

export default router
