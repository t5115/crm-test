import EmbeddedPostgres from 'embedded-postgres'
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'

// Local Postgres settings. Data lives in my-app/.postgres-data (git-ignored).
const DATA_DIR = path.resolve(import.meta.dirname, '../../.postgres-data')
const PORT = 5433
const DB_NAME = 'crm'

// If DATABASE_URL is set (e.g. a hosted Postgres), we use that and skip the local server.
const useLocalServer = !process.env.DATABASE_URL

const localServer = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  port: PORT,
  user: 'postgres',
  password: 'postgres',
  persistent: true,
  onLog: () => {},
  // Postgres writes all its logs to stderr, so only show real problems
  onError: (message) => {
    if (/ERROR|FATAL/.test(String(message))) console.error(String(message))
  },
})

// The pool is what the rest of the server uses to run queries.
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL ?? `postgres://postgres:postgres@localhost:${PORT}/${DB_NAME}`,
})

export async function startDatabase() {
  if (!useLocalServer) return

  // First run only: create the data folder and Postgres config files
  if (!fs.existsSync(DATA_DIR)) await localServer.initialise()
  await localServer.start()

  // Create our database if it doesn't exist yet
  const admin = localServer.getPgClient()
  await admin.connect()
  const { rowCount } = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME])
  await admin.end()
  if (rowCount === 0) await localServer.createDatabase(DB_NAME)
}

export async function stopDatabase() {
  await pool.end()
  if (useLocalServer) await localServer.stop()
}
