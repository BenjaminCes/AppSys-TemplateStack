import { Router } from 'express'
import { getDb } from '../db/connection'
import { requireAuth } from '../middleware/requireAuth'
import { requireRole } from '../middleware/requireRole'

interface UserRow {
  id: number
  email: string
  role: 'admin' | 'user'
  created_at: string
}

function fetchAllUsers(): UserRow[] {
  const db = getDb()
  const stmt = db.prepare('SELECT id, email, role, created_at FROM users ORDER BY id ASC')
  const rows: UserRow[] = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as unknown as UserRow)
  }
  stmt.free()
  return rows
}

const router = Router()

router.get('/users', requireAuth, requireRole('admin'), (_req, res) => {
  res.json({ users: fetchAllUsers() })
})

export default router
