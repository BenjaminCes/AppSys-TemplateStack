import { Router } from 'express'
import { getDb } from '../db/connection'
import { requireAuth } from '../middleware/requireAuth'

export interface SearchResult {
  type: 'item' | 'user'
  id: number
  title: string
  snippet: string
  category: string | null
  anchor: string
  route: string
}

function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, m => '\\' + m)
}

function searchItems(q: string, limit: number): SearchResult[] {
  const db = getDb()
  const pattern = `%${escapeLike(q.toLowerCase())}%`
  const stmt = db.prepare(
    `SELECT id, slug, title, description, category FROM items
     WHERE LOWER(title) LIKE ? ESCAPE '\\'
        OR LOWER(description) LIKE ? ESCAPE '\\'
        OR LOWER(slug) LIKE ? ESCAPE '\\'
     ORDER BY
       CASE
         WHEN LOWER(title) LIKE ? ESCAPE '\\' THEN 0
         WHEN LOWER(slug)  LIKE ? ESCAPE '\\' THEN 1
         ELSE 2
       END,
       title ASC
     LIMIT ?`
  )
  stmt.bind([pattern, pattern, pattern, pattern, pattern, limit])
  const out: SearchResult[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject() as {
      id: number
      slug: string
      title: string
      description: string
      category: string
    }
    out.push({
      type: 'item',
      id: row.id,
      title: row.title,
      snippet: row.description,
      category: row.category,
      anchor: `item-${row.id}`,
      route: '/'
    })
  }
  stmt.free()
  return out
}

function searchUsers(q: string, limit: number): SearchResult[] {
  const db = getDb()
  const pattern = `%${escapeLike(q.toLowerCase())}%`
  const stmt = db.prepare(
    `SELECT id, email FROM users
     WHERE LOWER(email) LIKE ? ESCAPE '\\'
     ORDER BY email ASC
     LIMIT ?`
  )
  stmt.bind([pattern, limit])
  const out: SearchResult[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject() as { id: number; email: string }
    out.push({
      type: 'user',
      id: row.id,
      title: row.email,
      snippet: 'Geregistreerde gebruiker',
      category: 'user',
      anchor: `user-${row.id}`,
      route: '/'
    })
  }
  stmt.free()
  return out
}

const router = Router()

router.get('/', requireAuth, (req, res) => {
  const raw = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  if (raw.length === 0) {
    res.json({ q: '', results: [] })
    return
  }
  if (raw.length > 100) {
    res.status(400).json({ error: 'query_too_long' })
    return
  }
  if (raw.length < 2) {
    res.json({ q: raw, results: [] })
    return
  }
  const items = searchItems(raw, 15)
  const users = searchUsers(raw, 5)
  res.json({ q: raw, results: [...items, ...users] })
})

export default router
