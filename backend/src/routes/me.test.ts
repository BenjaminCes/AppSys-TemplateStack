import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import { initDb, getDb } from '../db/connection'
import { runMigrations } from '../db/migrations'
import { buildApp } from '../server'

describe('GET /api/me', () => {
  let app: Express

  beforeAll(async () => {
    await initDb()
    runMigrations()
    app = await buildApp()
  })

  beforeEach(() => {
    getDb().run('DELETE FROM users')
  })

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/me')
    expect(res.status).toBe(401)
  })

  it('returns 401 with invalid token', async () => {
    const res = await request(app)
      .get('/api/me')
      .set('Authorization', 'Bearer not-a-real-token')
    expect(res.status).toBe(401)
  })

  it('returns 200 + user with valid token', async () => {
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ email: 'frank@example.com', password: 'supersecret1' })
    const token = reg.body.token as string

    const res = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe('frank@example.com')
  })
})
