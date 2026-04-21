import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { clerkPlugin } from '@clerk/vue'
import App from './App.vue'
import { router } from './router'
import './style.css'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!publishableKey) {
  console.warn('[app] VITE_CLERK_PUBLISHABLE_KEY is niet gezet. Auth zal falen tot je .env invult.')
}

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(clerkPlugin, { publishableKey: publishableKey ?? '' })
app.mount('#app')
