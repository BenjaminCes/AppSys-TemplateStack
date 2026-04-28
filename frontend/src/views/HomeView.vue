<script setup lang="ts">
import AppShell from '@/components/layout/AppShell.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const features: { title: string; body: string }[] = [
  { title: 'Huisstijl ingebakken', body: 'Navy + oranje + groen + cyaan via brand.* tokens. AppShell met sidebar en topbar uit de doos.' },
  { title: 'Live zoekbalk', body: 'Ctrl+K of klik in de balk. Zoekt server-side in items en gebruikers, scrollt naar het juiste paneel.' },
  { title: 'Lokale auth (JWT + bcrypt)', body: 'Geen externe identity-provider nodig. Register en login werken direct na install.' },
  { title: 'RBAC standaard', body: 'admin- en user-rol vanaf dag 1. Admin-seed: admin@appsys.local / appsys00. Beheer-pagina admin-only.' },
  { title: 'SQLite via sql.js', body: 'Zero native binaries. File-persist op backend/data/app.db, migrations runnen automatisch op opstart.' },
  { title: 'ESLint guardrails', body: 'Tailwind kleur-classes buiten brand.* worden geblokkeerd. Externe UI-libs (Vuetify, Bootstrap, MUI, ...) zijn dichtgetimmerd.' },
  { title: 'Pre-commit hook', body: 'Em-dashes, hardcoded hex-codes, LLM-tell-emojis en lint-errors blokkeren de commit. Activeert automatisch bij npm install.' },
  { title: 'Skills meegeleverd', body: '/start-sessie, /einde-sessie en /nieuw-project via onboarding/install-skills.{ps1,sh}.' }
]
</script>

<template>
  <AppShell
    page-title="Welkom"
    eyebrow="Overzicht"
  >
    <div class="px-6 py-10 max-w-5xl mx-auto">
      <header class="mb-10">
        <p class="text-[11px] font-mono uppercase tracking-wider text-brand-orange mb-2">
          AppSys Template
        </p>
        <h1 class="text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
          Klaar om te bouwen.
        </h1>
        <p class="text-base text-gray-600 leading-relaxed max-w-3xl">
          Deze scaffold geeft je een werkend product op dag 1: huisstijl, layout, auth, RBAC, lokale database, search en
          quality gates. Hieronder zie je wat er uit de doos zit. Begin met
          <code class="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">docs/MVP.md</code> en
          <code class="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">docs/PROJECT-BRIEF.md</code> om je MVP te
          definieren, en lees <code class="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">docs/STACK-STANDARD.md</code>
          voor de huisregels.
        </p>
      </header>

      <section class="mb-10">
        <h2 class="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Wat zit erin
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <article
            v-for="(f, idx) in features"
            :key="f.title"
            class="bg-white border border-gray-200 rounded-lg p-5"
          >
            <div class="flex items-baseline gap-3">
              <span class="text-[10px] font-mono text-gray-400">{{ String(idx + 1).padStart(2, '0') }}</span>
              <div>
                <div class="text-sm font-semibold text-gray-900 mb-1">
                  {{ f.title }}
                </div>
                <p class="text-xs text-gray-600 leading-relaxed">
                  {{ f.body }}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section>
        <h2 class="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Volgende stappen
        </h2>
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <ul class="divide-y divide-gray-100">
            <li class="px-5 py-4 flex items-center justify-between text-sm">
              <span class="text-gray-700">Vul <code class="font-mono text-xs">docs/MVP.md</code> en <code class="font-mono text-xs">docs/PROJECT-BRIEF.md</code> in</span>
              <span class="text-xs text-gray-400">stap 1</span>
            </li>
            <li class="px-5 py-4 flex items-center justify-between text-sm">
              <span class="text-gray-700">Pas sidebar-items aan in <code class="font-mono text-xs">src/components/layout/AppShell.vue</code></span>
              <span class="text-xs text-gray-400">stap 2</span>
            </li>
            <li class="px-5 py-4 flex items-center justify-between text-sm">
              <span class="text-gray-700">Voeg eigen routes toe aan <code class="font-mono text-xs">src/router/index.ts</code></span>
              <span class="text-xs text-gray-400">stap 3</span>
            </li>
            <li
              v-if="auth.isAdmin"
              class="px-5 py-4 flex items-center justify-between text-sm"
            >
              <span class="text-gray-700">Bekijk het beheerspanel</span>
              <RouterLink
                to="/admin"
                class="text-xs font-medium text-brand-orange hover:text-brand-orange-hover"
              >
                Open Beheer
              </RouterLink>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </AppShell>
</template>
