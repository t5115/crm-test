// The API server. Starts Postgres, then serves /api/* for the React app.
// Run with: npm run server
import express from 'express'
import { startDatabase } from './db/postgres.js'
import { setupDatabase } from './db/setup.js'
import stages from './routes/stages.js'
import tickets from './routes/tickets.js'
import tasks from './routes/tasks.js'
import events from './routes/events.js'
import me from './routes/me.js'
import widgets from './routes/widgets.js'

const PORT = 3001

const app = express()
app.use(express.json())

app.use('/api/stages', stages)
app.use('/api/tickets', tickets)
app.use('/api/tasks', tasks)
app.use('/api/events', events)
app.use('/api/me', me)
app.use('/api/widgets', widgets)

// Any error thrown in a route ends up here
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

await startDatabase()
await setupDatabase()
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
