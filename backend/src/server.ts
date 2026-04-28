import express from 'express'
import cors from 'cors'
import { config } from './config'
import { initDb, closeDb } from './db/connection'
import { runMigrations } from './db/migrations'
import healthRouter from './routes/health'
import authRouter from './routes/auth'
import meRouter from './routes/me'
import itemsRouter from './routes/items'
import searchRouter from './routes/search'
import adminRouter from './routes/admin'

export async function buildApp(): Promise<express.Express> {
  const app = express()
  app.use(cors({ origin: config.corsOrigins }))
  app.use(express.json({ limit: '2mb' }))
  app.use('/api/health', healthRouter)
  app.use('/api/auth', authRouter)
  app.use('/api/me', meRouter)
  app.use('/api/items', itemsRouter)
  app.use('/api/search', searchRouter)
  app.use('/api/admin', adminRouter)
  return app
}

async function main(): Promise<void> {
  await initDb()
  runMigrations()

  const app = await buildApp()
  const server = app.listen(config.PORT, () => {
    console.log(`[backend] luistert op poort ${config.PORT} (env: ${config.NODE_ENV})`)
  })

  const shutdown = (signal: string): void => {
    console.log(`[backend] ${signal} ontvangen, afsluiten...`)
    server.close(() => {
      closeDb()
      process.exit(0)
    })
  }
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

if (require.main === module) {
  main().catch(err => {
    console.error('[backend] boot failure:', err)
    process.exit(1)
  })
}
