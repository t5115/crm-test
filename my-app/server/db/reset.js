// Wipes the database and reloads the mock data. Run with: npm run db:reset
import { startDatabase, stopDatabase } from './postgres.js'
import { setupDatabase } from './setup.js'

await startDatabase()
await setupDatabase({ reset: true })
await stopDatabase()
