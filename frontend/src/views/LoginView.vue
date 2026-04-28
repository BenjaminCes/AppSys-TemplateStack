<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)

async function submit(): Promise<void> {
  error.value = ''
  busy.value = true
  try {
    await auth.login(email.value.trim(), password.value)
    await router.push('/')
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } }).response?.status
    error.value = status === 401 ? 'Onjuiste login.' : 'Er ging iets mis.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <main class="min-h-screen flex items-center justify-center px-6">
    <form
      class="w-full max-w-sm bg-white p-8 rounded-lg shadow space-y-4"
      @submit.prevent="submit"
    >
      <h1 class="text-2xl font-bold">
        Inloggen
      </h1>

      <label class="block">
        <span class="text-sm text-slate-700">Email</span>
        <input
          v-model="email"
          type="email"
          required
          autocomplete="email"
          class="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring focus:border-brand-500"
        >
      </label>

      <label class="block">
        <span class="text-sm text-slate-700">Wachtwoord</span>
        <input
          v-model="password"
          type="password"
          required
          minlength="8"
          autocomplete="current-password"
          class="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring focus:border-brand-500"
        >
      </label>

      <p
        v-if="error"
        class="text-sm text-red-600"
      >
        {{ error }}
      </p>

      <button
        type="submit"
        :disabled="busy"
        class="w-full rounded bg-brand-600 text-white py-2 font-medium hover:bg-brand-700 disabled:opacity-50"
      >
        {{ busy ? 'Bezig...' : 'Inloggen' }}
      </button>

      <p class="text-sm text-slate-600">
        Nog geen account?
        <router-link
          to="/register"
          class="text-brand-600 hover:underline"
        >
          Registreren
        </router-link>
      </p>
    </form>
  </main>
</template>
