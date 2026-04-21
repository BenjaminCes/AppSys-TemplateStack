import type { Request, Response, NextFunction } from 'express'
import { verifyToken, getUserById, type PublicUser } from '../services/authService'

declare module 'express-serve-static-core' {
  interface Request {
    user?: PublicUser
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.header('authorization') ?? ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  if (!match) {
    res.status(401).json({ error: 'missing_token' })
    return
  }
  try {
    const { sub } = verifyToken(match[1])
    const user = getUserById(sub)
    if (!user) {
      res.status(401).json({ error: 'invalid_token' })
      return
    }
    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'invalid_token' })
  }
}
