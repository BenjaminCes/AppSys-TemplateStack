<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function onLogout(): void {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <main class="max-w-3xl mx-auto px-6 py-16">
    <header class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold">PROJECT_NAME</h1>
      <div v-if="auth.user" class="flex items-center gap-3 text-sm">
        <span class="text-slate-600">{{ auth.user.email }}</span>
        <button
          class="rounded border border-slate-300 px-3 py-1 hover:bg-slate-100"
          @click="onLogout"
        >Uitloggen</button>
      </div>
    </header>

    <p class="text-slate-600 mb-6">
      Welkom. Vul <code>docs/MVP.md</code> en <code>docs/PROJECT-BRIEF.md</code> in om te beginnen.
    </p>
    <ul class="list-disc pl-6 text-sm text-slate-700 space-y-1">
      <li>Stack: Vue 3 + Vite + TS + Pinia + Tailwind</li>
      <li>Auth: lokaal (JWT + bcrypt), zie <code>backend/src/services/authService.ts</code></li>
      <li>Backend: <code>http://localhost:3001/api/health</code></li>
      <li>Standaard: <code>docs/STACK-STANDARD.md</code></li>
    </ul>
  </main>
</template>
