import { Router } from 'express'
import { getDb } from '../db/connection'
import { requireAuth } from '../middleware/requireAuth'

interface ItemRow {
  id: number
  slug: string
  title: string
  description: string
  category: string
  status: string
  created_at: string
}

function fetchAllItems(): ItemRow[] {
  const db = getDb()
  const stmt = db.prepare(
    'SELECT id, slug, title, description, category, status, created_at FROM items ORDER BY id ASC'
  )
  const rows: ItemRow[] = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as unknown as ItemRow)
  }
  stmt.free()
  return rows
}

function fetchItemById(id: number): ItemRow | null {
  const db = getDb()
  const stmt = db.prepare(
    'SELECT id, slug, title, description, category, status, created_at FROM items WHERE id = ?'
  )
  stmt.bind([id])
  const row = stmt.step() ? (stmt.getAsObject() as unknown as ItemRow) : null
  stmt.free()
  return row
}

const router = Router()

router.get('/', requireAuth, (_req, res) => {
  res.json({ items: fetchAllItems() })
})

router.get('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id) || id <= 0) {
    res.status(400).json({ error: 'invalid_id' })
    return
  }
  const item = fetchItemById(id)
  if (!item) {
    res.status(404).json({ error: 'not_found' })
    return
  }
  res.json({ item })
})

export default router
