import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const config = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3001),
  dbFilePath: path.resolve(__dirname, '../data/app.db'),
  clerkSecretKey: process.env.CLERK_SECRET_KEY ?? '',
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173').split(',').map(s => s.trim())
}
