import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import { initDb, getDb } from '../db/connection'
import { runMigrations } from '../db/migrations'
import { buildApp } from '../server'

describe('auth routes', () => {
  let app: Express

  beforeAll(async () => {
    await initDb()
    runMigrations()
    app = await buildApp()
  })

  beforeEach(() => {
    getDb().run('DELETE FROM users')
  })

  describe('POST /api/auth/register', () => {
    it('creates a user and returns 201 + token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'alice@example.com', password: 'supersecret1' })
      expect(res.status).toBe(201)
      expect(res.body.user).toMatchObject({ email: 'alice@example.com' })
      expect(typeof res.body.user.id).toBe('number')
      expect(typeof res.body.token).toBe('string')
    })

    it('rejects invalid email with 400', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'not-an-email', password: 'supersecret1' })
      expect(res.status).toBe(400)
    })

    it('rejects short password with 400', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'bob@example.com', password: 'short' })
      expect(res.status).toBe(400)
    })

    it('rejects duplicate email with 409', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'carol@example.com', password: 'supersecret1' })
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'carol@example.com', password: 'anotherpass1' })
      expect(res.status).toBe(409)
      expect(res.body.error).toBe('email_taken')
    })
  })

  describe('POST /api/auth/login', () => {
    it('returns 200 + token on valid credentials', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'dave@example.com', password: 'supersecret1' })
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'dave@example.com', password: 'supersecret1' })
      expect(res.status).toBe(200)
      expect(res.body.user.email).toBe('dave@example.com')
      expect(typeof res.body.token).toBe('string')
    })

    it('returns 401 on wrong password', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'eve@example.com', password: 'supersecret1' })
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'eve@example.com', password: 'wrongpass' })
      expect(res.status).toBe(401)
    })

    it('returns 401 for nonexistent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'supersecret1' })
      expect(res.status).toBe(401)
    })
  })
})
