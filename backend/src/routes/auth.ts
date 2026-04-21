import { Router } from 'express'
import { z } from 'zod'
import { AuthError, loginUser, registerUser, signToken } from '../services/authService'

const credentialsSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200)
})

const router = Router()

router.post('/register', async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_input', issues: parsed.error.flatten() })
    return
  }
  try {
    const user = await registerUser(parsed.data.email.toLowerCase(), parsed.data.password)
    const token = signToken(user.id)
    res.status(201).json({ user, token })
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.status).json({ error: err.message })
      return
    }
    res.status(500).json({ error: 'internal_error' })
  }
})

router.post('/login', async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_input' })
    return
  }
  try {
    const result = await loginUser(parsed.data.email.toLowerCase(), parsed.data.password)
    res.json(result)
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.status).json({ error: err.message })
      return
    }
    res.status(500).json({ error: 'internal_error' })
  }
})

export default router
