<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppShell from '@/components/layout/AppShell.vue'
import { apiClient } from '@/api/client'
import { useItemsStore } from '@/stores/items'
import type { AdminUser } from '@/types/domain'

const items = useItemsStore()
const users = ref<AdminUser[]>([])
const usersLoading = ref(false)
const usersError = ref<string | null>(null)

async function loadUsers(): Promise<void> {
  usersLoading.value = true
  usersError.value = null
  try {
    const { data } = await apiClient.get<{ users: AdminUser[] }>('/admin/users')
    users.value = data.users
  } catch (err: unknown) {
    usersError.value = err instanceof Error ? err.message : 'Onbekende fout'
  } finally {
    usersLoading.value = false
  }
}

onMounted(() => {
  if (items.items.length === 0) void items.fetchAll()
  void loadUsers()
})

function formatDate(value: string): string {
  if (!value) return ''
  return value.replace('T', ' ').replace(/\..*$/, '')
}
</script>

<template>
  <AppShell
    page-title="Beheer"
    eyebrow="Admin"
  >
    <div class="px-6 py-8 max-w-6xl mx-auto">
      <header class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900 mb-1">
          Beheerspanel
        </h1>
        <p class="text-sm text-gray-600">
          Admin-only pagina. Hier breidt de engineer de eigen domein-resources uit; de items hieronder zijn de seed-rijen
          uit <code class="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">backend/src/db/migrations/002_items.sql</code>.
        </p>
      </header>

      <section class="mb-10">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Items
          </h2>
          <span class="text-xs text-gray-400">{{ items.items.length }} items</span>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th
                  class="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                  style="width:90px"
                >
                  Slug
                </th>
                <th
                  class="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                  style="width:160px"
                >
                  Titel
                </th>
                <th class="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Beschrijving
                </th>
                <th
                  class="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                  style="width:120px"
                >
                  Categorie
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in items.items"
                :id="`item-${item.id}`"
                :key="item.id"
                class="border-b border-gray-100 last:border-b-0"
              >
                <td class="px-5 py-3 font-mono text-xs text-gray-500">
                  {{ item.slug }}
                </td>
                <td class="px-5 py-3 font-semibold text-gray-900">
                  {{ item.title }}
                </td>
                <td class="px-5 py-3 text-gray-600">
                  {{ item.description }}
                </td>
                <td class="px-5 py-3">
                  <span class="text-[11px] font-medium text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">{{ item.category }}</span>
                </td>
              </tr>
              <tr v-if="items.loading && items.items.length === 0">
                <td
                  colspan="4"
                  class="px-5 py-6 text-sm text-gray-400 text-center"
                >
                  Items laden...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Gebruikers
          </h2>
          <RouterLink
            to="/register"
            class="text-xs text-brand-orange hover:text-brand-orange-hover font-medium"
          >
            Nieuwe gebruiker registreren
          </RouterLink>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th
                  class="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                  style="width:60px"
                >
                  ID
                </th>
                <th class="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th
                  class="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                  style="width:100px"
                >
                  Rol
                </th>
                <th
                  class="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                  style="width:200px"
                >
                  Aangemaakt
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="u in users"
                :id="`user-${u.id}`"
                :key="u.id"
                class="border-b border-gray-100 last:border-b-0"
              >
                <td class="px-5 py-3 font-mono text-xs text-gray-500">
                  {{ u.id }}
                </td>
                <td class="px-5 py-3 text-gray-900">
                  {{ u.email }}
                </td>
                <td class="px-5 py-3">
                  <span
                    class="text-[11px] font-medium px-2 py-0.5 rounded-full"
                    :class="u.role === 'admin' ? 'text-brand-orange bg-brand-orange/10' : 'text-gray-600 bg-gray-100'"
                  >{{ u.role }}</span>
                </td>
                <td class="px-5 py-3 font-mono text-xs text-gray-500">
                  {{ formatDate(u.created_at) }}
                </td>
              </tr>
              <tr v-if="usersLoading && users.length === 0">
                <td
                  colspan="4"
                  class="px-5 py-6 text-sm text-gray-400 text-center"
                >
                  Gebruikers laden...
                </td>
              </tr>
              <tr v-if="usersError">
                <td
                  colspan="4"
                  class="px-5 py-6 text-sm text-red-600 text-center"
                >
                  {{ usersError }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </AppShell>
</template>
