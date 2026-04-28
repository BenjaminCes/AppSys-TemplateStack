import type { Request, Response, NextFunction } from 'express'
import type { Role } from '../services/authService'

export function requireRole(...allowed: Role[]) {
  return function (req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      res.status(401).json({ error: 'missing_token' })
      return
    }
    if (!allowed.includes(req.user.role)) {
      res.status(403).json({ error: 'forbidden', required: allowed })
      return
    }
    next()
  }
}
