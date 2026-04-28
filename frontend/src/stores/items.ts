import { defineStore } from 'pinia'
import { apiClient } from '@/api/client'
import type { Item, SearchResult } from '@/types/domain'

interface ItemsState {
  items: Item[]
  loading: boolean
  searchQuery: string
  searchResults: SearchResult[]
  searching: boolean
  searchError: string | null
}

let searchTimer: ReturnType<typeof setTimeout> | null = null
let searchRequestId = 0

export const useItemsStore = defineStore('items', {
  state: (): ItemsState => ({
    items: [],
    loading: false,
    searchQuery: '',
    searchResults: [],
    searching: false,
    searchError: null
  }),

  actions: {
    async fetchAll(): Promise<void> {
      this.loading = true
      try {
        const { data } = await apiClient.get<{ items: Item[] }>('/items')
        this.items = data.items
      } finally {
        this.loading = false
      }
    },

    setSearchQuery(q: string): void {
      this.searchQuery = q
      if (searchTimer) clearTimeout(searchTimer)
      const trimmed = q.trim()
      if (trimmed.length < 2) {
        this.searchResults = []
        this.searching = false
        this.searchError = null
        return
      }
      this.searching = true
      searchTimer = setTimeout(() => void this.runSearch(trimmed), 180)
    },

    async runSearch(q: string): Promise<void> {
      const requestId = ++searchRequestId
      try {
        const { data } = await apiClient.get<{ q: string; results: SearchResult[] }>(
          '/search',
          { params: { q } }
        )
        if (requestId !== searchRequestId) return
        this.searchResults = data.results
        this.searchError = null
      } catch (err: unknown) {
        if (requestId !== searchRequestId) return
        this.searchResults = []
        this.searchError = err instanceof Error ? err.message : 'Onbekende fout'
      } finally {
        if (requestId === searchRequestId) {
          this.searching = false
        }
      }
    },

    clearSearch(): void {
      if (searchTimer) clearTimeout(searchTimer)
      this.searchQuery = ''
      this.searchResults = []
      this.searching = false
      this.searchError = null
    }
  }
})
