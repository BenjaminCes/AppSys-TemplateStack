// Domain types voor dit project. Uitbreiden naarmate de MVP groeit.
export interface HealthResponse {
  status: 'ok'
  timestamp: string
}

export interface Item {
  id: number
  slug: string
  title: string
  description: string
  category: string
  status: string
  created_at: string
}

export interface SearchResult {
  type: 'item' | 'user'
  id: number
  title: string
  snippet: string
  category: string | null
  anchor: string
  route: string
}

export type Role = 'admin' | 'user'

export interface AdminUser {
  id: number
  email: string
  role: Role
  created_at: string
}
