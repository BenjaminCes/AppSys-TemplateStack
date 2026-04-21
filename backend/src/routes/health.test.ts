import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import { initDb } from '../db/connection'
import { runMigrations } from '../db/migrations'
import { buildApp } from '../server'

describe('GET /api/health', () => {
  let app: Express

  beforeAll(async () => {
    await initDb()
    runMigrations()
    app = await buildApp()
  })

  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(typeof res.body.timestamp).toBe('string')
  })
})
