import initSqlJs, { Database } from 'sql.js'
import * as fs from 'fs'
import * as path from 'path'
import { config } from '../config'

let db: Database | null = null
let SQL: Awaited<ReturnType<typeof initSqlJs>> | null = null

export async function initDb(): Promise<Database> {
  if (db) return db

  SQL = await initSqlJs()
  const dbPath = config.dbFilePath
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  if (fs.existsSync(dbPath)) {
    const buf = fs.readFileSync(dbPath)
    db = new SQL.Database(new Uint8Array(buf))
  } else {
    db = new SQL.Database()
  }

  db.run('PRAGMA foreign_keys = ON;')
  return db
}

export function getDb(): Database {
  if (!db) throw new Error('DB not initialized. Call initDb() first.')
  return db
}

export function saveDb(): void {
  if (!db) return
  const data = db.export()
  fs.writeFileSync(config.dbFilePath, Buffer.from(data))
}

export function closeDb(): void {
  if (db) {
    saveDb()
    db.close()
    db = null
  }
}
