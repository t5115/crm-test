import fs from 'node:fs'
import path from 'node:path'
import { pool } from './postgres.js'

const readSql = (file) => fs.readFileSync(path.join(import.meta.dirname, file), 'utf8')

// Creates the tables and mock data if they aren't there yet.
// With reset: true it wipes everything first and starts fresh.
export async function setupDatabase({ reset = false } = {}) {
  if (reset) await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')

  // to_regclass returns NULL when the table doesn't exist
  const { rows } = await pool.query("SELECT to_regclass('public.stages') AS found")
  if (rows[0].found) return

  await pool.query(readSql('schema.sql'))
  await pool.query(readSql('seed.sql'))
  console.log('Database tables created and filled with mock data')
}
