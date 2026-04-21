import bcrypt from 'bcryptjs'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { config } from '../config'
import { getDb, saveDb } from '../db/connection'

export type PublicUser = { id: number; email: string }

const BCRYPT_ROUNDS = 10

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

export function signToken(userId: number): string {
  return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as SignOptions)
}

export function verifyToken(token: string): { sub: number } {
  const payload = jwt.verify(token, config.jwtSecret) as { sub: number | string }
  const sub = typeof payload.sub === 'string' ? Number(payload.sub) : payload.sub
  if (!Number.isFinite(sub)) throw new Error('Invalid token payload')
  return { sub }
}

export class AuthError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function registerUser(email: string, password: string): Promise<PublicUser> {
  const db = getDb()
  const existing = db.exec('SELECT id FROM users WHERE email = ?', [email])
  if (existing.length > 0 && existing[0].values.length > 0) {
    throw new AuthError(409, 'email_taken')
  }
  const hash = await hashPassword(password)
  db.run('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hash])
  const rows = db.exec('SELECT id, email FROM users WHERE email = ?', [email])
  saveDb()
  const [id, storedEmail] = rows[0].values[0] as [number, string]
  return { id, email: storedEmail }
}

export async function loginUser(email: string, password: string): Promise<{ user: PublicUser; token: string }> {
  const db = getDb()
  const rows = db.exec('SELECT id, email, password_hash FROM users WHERE email = ?', [email])
  if (rows.length === 0 || rows[0].values.length === 0) {
    throw new AuthError(401, 'invalid_credentials')
  }
  const [id, storedEmail, hash] = rows[0].values[0] as [number, string, string]
  const ok = await verifyPassword(password, hash)
  if (!ok) throw new AuthError(401, 'invalid_credentials')
  return { user: { id, email: storedEmail }, token: signToken(id) }
}

export function getUserById(id: number): PublicUser | null {
  const db = getDb()
  const rows = db.exec('SELECT id, email FROM users WHERE id = ?', [id])
  if (rows.length === 0 || rows[0].values.length === 0) return null
  const [rowId, email] = rows[0].values[0] as [number, string]
  return { id: rowId, email }
}
