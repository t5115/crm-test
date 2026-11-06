import { Router } from 'express'
import { pool } from '../db/postgres.js'
import { CURRENT_USER_ID } from '../currentUser.js'

const router = Router()

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT widget_key, visible FROM user_widgets WHERE user_id = $1 ORDER BY position',
    [CURRENT_USER_ID],
  )
  res.json(rows)
})

// Show or hide one widget: PATCH /api/widgets/todo { visible: false }
router.patch('/:key', async (req, res) => {
  await pool.query(
    'UPDATE user_widgets SET visible = $1 WHERE user_id = $2 AND widget_key = $3',
    [Boolean(req.body.visible), CURRENT_USER_ID, req.params.key],
  )
  res.status(204).end()
})

export default router
