import * as fs from 'fs'
import * as path from 'path'
import { getDb, saveDb } from './connection'

export function runMigrations(): void {
  const db = getDb()
  db.run(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`)

  const appliedRes = db.exec('SELECT version FROM schema_migrations')
  const applied = new Set<string>()
  if (appliedRes[0]) {
    for (const row of appliedRes[0].values) applied.add(String(row[0]))
  }

  const migrationsDir = path.join(__dirname, 'migrations')
  if (!fs.existsSync(migrationsDir)) return

  const files = fs
    .readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    if (applied.has(file)) continue
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')
    console.log(`[migration] applying ${file}`)
    db.exec('BEGIN')
    try {
      db.exec(sql)
      db.run('INSERT INTO schema_migrations (version) VALUES (?)', [file])
      db.exec('COMMIT')
    } catch (err) {
      db.exec('ROLLBACK')
      console.error(`[migration] failed on ${file}:`, err)
      throw err
    }
  }
  saveDb()
}
