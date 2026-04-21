import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const rawJwtSecret = process.env.JWT_SECRET ?? ''
const isDefaultSecret = rawJwtSecret === '' || rawJwtSecret === 'change-me-in-production'

if (isDefaultSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set to a non-default value in production. See .env.example.')
}

export const config = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3001),
  dbFilePath: path.resolve(__dirname, '../data/app.db'),
  jwtSecret: rawJwtSecret || 'dev-only-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173').split(',').map(s => s.trim())
}
