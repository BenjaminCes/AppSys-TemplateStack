import { defineStore } from 'pinia'
import { apiClient } from '@/api/client'

export type User = { id: number; email: string }

type AuthState = {
  user: User | null
  token: string | null
}

const TOKEN_KEY = 'auth.token'
const USER_KEY = 'auth.user'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (s): boolean => !!s.token && !!s.user
  },

  actions: {
    hydrate() {
      const token = localStorage.getItem(TOKEN_KEY)
      const userRaw = localStorage.getItem(USER_KEY)
      if (token && userRaw) {
        this.token = token
        try {
          this.user = JSON.parse(userRaw) as User
        } catch {
          this.logout()
        }
      }
    },

    async register(email: string, password: string): Promise<void> {
      const { data } = await apiClient.post<{ user: User; token: string }>('/auth/register', { email, password })
      this.setSession(data.user, data.token)
    },

    async login(email: string, password: string): Promise<void> {
      const { data } = await apiClient.post<{ user: User; token: string }>('/auth/login', { email, password })
      this.setSession(data.user, data.token)
    },

    async fetchMe(): Promise<void> {
      const { data } = await apiClient.get<{ user: User }>('/me')
      this.user = data.user
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    },

    setSession(user: User, token: string) {
      this.user = user
      this.token = token
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }
})
