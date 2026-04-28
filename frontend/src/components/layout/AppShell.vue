<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useItemsStore } from '@/stores/items'
import type { SearchResult } from '@/types/domain'

defineProps<{
  pageTitle?: string
  eyebrow?: string
}>()

const auth = useAuthStore()
const items = useItemsStore()
const router = useRouter()
const route = useRoute()
const sidebarOpen = ref(false)

const searchInputRef = ref<HTMLInputElement | null>(null)
const searchWrapperRef = ref<HTMLElement | null>(null)
const searchFocused = ref(false)
const activeIndex = ref(-1)

const showDropdown = computed(() => {
  if (!searchFocused.value) return false
  const q = items.searchQuery.trim()
  if (q.length < 2) return false
  return items.searching || items.searchResults.length > 0 || items.searchError !== null
})

function onSearchInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  items.setSearchQuery(value)
  activeIndex.value = -1
}

function onSearchFocus(): void {
  searchFocused.value = true
}

function onSearchBlur(event: FocusEvent): void {
  // Niet sluiten als focus naar een result-button binnen dezelfde wrapper gaat.
  const next = event.relatedTarget as Node | null
  if (next && searchWrapperRef.value?.contains(next)) return
  setTimeout(() => {
    searchFocused.value = false
  }, 120)
}

async function pickResult(result: SearchResult): Promise<void> {
  if (route.fullPath !== result.route) {
    await router.push(result.route)
  }
  await nextTick()
  const el = document.getElementById(result.anchor)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('search-flash')
    window.setTimeout(() => el.classList.remove('search-flash'), 1400)
  }
  items.clearSearch()
  searchFocused.value = false
  searchInputRef.value?.blur()
}

function onSearchKeydown(event: KeyboardEvent): void {
  const results = items.searchResults
  if (event.key === 'Escape') {
    items.clearSearch()
    searchInputRef.value?.blur()
    return
  }
  if (event.key === 'ArrowDown') {
    if (results.length === 0) return
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % results.length
    return
  }
  if (event.key === 'ArrowUp') {
    if (results.length === 0) return
    event.preventDefault()
    activeIndex.value = activeIndex.value <= 0 ? results.length - 1 : activeIndex.value - 1
    return
  }
  if (event.key === 'Enter') {
    if (activeIndex.value >= 0 && results[activeIndex.value]) {
      event.preventDefault()
      void pickResult(results[activeIndex.value])
    } else if (results[0]) {
      event.preventDefault()
      void pickResult(results[0])
    }
  }
}

function onGlobalKeydown(event: KeyboardEvent): void {
  if ((event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchInputRef.value?.focus()
    searchInputRef.value?.select()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onGlobalKeydown)
  void items.fetchAll()
})

onUnmounted(() => {
  document.removeEventListener('keydown', onGlobalKeydown)
})

function onLogout(): void {
  auth.logout()
  router.replace('/login')
}
</script>

<template>
  <div class="flex h-screen app-shell">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/40 z-30 lg:hidden"
      @click="sidebarOpen = false"
    />

    <aside
      class="app-sidebar flex flex-col shrink-0 fixed z-40 h-full transition-transform lg:relative lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="app-sidebar__brand">
        <img
          src="/brand/heartbeat-icon.svg"
          alt=""
          class="app-sidebar__logo"
        >
      </div>

      <nav class="app-sidebar__nav">
        <RouterLink
          to="/"
          class="app-sidebar__link"
          active-class="app-sidebar__link--active"
          :exact-active-class="'app-sidebar__link--active'"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Home
        </RouterLink>

        <div class="app-sidebar__section">
          Werkruimte
        </div>
        <a
          href="#"
          class="app-sidebar__link"
          @click.prevent
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM9 15h6"
            />
          </svg>
          Items
        </a>
        <a
          href="#"
          class="app-sidebar__link"
          @click.prevent
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17v-2a4 4 0 014-4h6m0 0l-3-3m3 3l-3 3M3 7h6"
            />
          </svg>
          Rapporten
        </a>

        <template v-if="auth.isAdmin">
          <div class="app-sidebar__section">
            Beheer
          </div>
          <RouterLink
            to="/admin"
            class="app-sidebar__link"
            active-class="app-sidebar__link--active"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Beheerspanel
          </RouterLink>
        </template>
      </nav>

      <div class="app-sidebar__foot">
        <div class="app-sidebar__user">
          <span
            class="app-sidebar__user-name"
            :title="auth.user?.email"
          >{{ auth.user?.email || '...' }}</span>
          <button
            type="button"
            class="app-sidebar__logout"
            title="Uitloggen"
            @click="onLogout"
          >
            Uitloggen
          </button>
        </div>
        <div class="app-sidebar__brandline">
          AppSys ICT Group
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="app-topbar">
        <div class="flex items-center gap-3 shrink-0">
          <button
            class="app-topbar__burger lg:hidden"
            aria-label="Menu"
            @click="sidebarOpen = !sidebarOpen"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span
            v-if="eyebrow"
            class="app-topbar__eyebrow"
          >{{ eyebrow }}</span>
          <h2 class="app-topbar__title">
            {{ pageTitle ?? 'Dashboard' }}
          </h2>
        </div>

        <div class="flex-1 flex justify-center px-4 min-w-0">
          <div
            ref="searchWrapperRef"
            class="search-wrapper w-full max-w-2xl"
          >
            <label class="search-field">
              <svg
                class="search-field__icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <input
                ref="searchInputRef"
                type="search"
                :value="items.searchQuery"
                placeholder="Zoeken..."
                aria-label="Zoeken (Ctrl+K)"
                autocomplete="off"
                spellcheck="false"
                class="search-field__input"
                @input="onSearchInput"
                @focus="onSearchFocus"
                @blur="onSearchBlur"
                @keydown="onSearchKeydown"
              >
              <kbd class="search-field__kbd hidden md:inline-flex">
                <span>Ctrl</span><span>K</span>
              </kbd>
            </label>

            <div
              v-if="showDropdown"
              class="search-dropdown"
              role="listbox"
            >
              <div
                v-if="items.searching"
                class="search-dropdown__status"
              >
                Zoeken...
              </div>
              <div
                v-else-if="items.searchError"
                class="search-dropdown__status search-dropdown__status--error"
              >
                Kon niet zoeken: {{ items.searchError }}
              </div>
              <template v-else-if="items.searchResults.length > 0">
                <button
                  v-for="(result, idx) in items.searchResults"
                  :key="`${result.type}-${result.id}`"
                  type="button"
                  role="option"
                  :aria-selected="activeIndex === idx"
                  class="search-result"
                  :class="{ 'search-result--active': activeIndex === idx }"
                  @mousedown.prevent="pickResult(result)"
                  @mouseenter="activeIndex = idx"
                >
                  <span class="search-result__type">{{ result.type === 'user' ? 'Gebruiker' : (result.category ?? 'Item') }}</span>
                  <span class="search-result__title">{{ result.title }}</span>
                  <span class="search-result__snippet">{{ result.snippet }}</span>
                </button>
              </template>
              <div
                v-else
                class="search-dropdown__status"
              >
                Geen treffers voor "{{ items.searchQuery }}"
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Tools
          </button>
          <span
            class="app-topbar__divider"
            aria-hidden="true"
          />
          <button class="bg-brand-orange text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-orange-hover transition-colors">
            + Nieuw
          </button>
        </div>
      </header>

      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell { background: var(--surface-2); }

.app-sidebar {
  width: var(--sidebar-width);
  background: linear-gradient(180deg, #1f2432 0%, #252A3A 60%, #1a1f2c 100%);
  color: var(--ink-50);
  border-right: 1px solid rgba(255, 255, 255, 0.04);
}

.app-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 16px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.app-sidebar__logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
}

.app-sidebar__nav {
  flex: 1;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.app-sidebar__section {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.38);
  padding: 14px 12px 4px;
}

.app-sidebar__section:first-child { padding-top: 2px; }

.app-sidebar__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 12.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.64);
  text-decoration: none;
  letter-spacing: 0.01em;
  transition: color var(--duration-fast) var(--ease-out),
              background var(--duration-fast) var(--ease-out);
}

.app-sidebar__link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.app-sidebar__link--active {
  color: #fff;
  background: rgba(241, 134, 11, 0.15);
  box-shadow: inset 2px 0 0 var(--brand-orange);
}

.app-sidebar__link :deep(svg) {
  width: 15px;
  height: 15px;
  opacity: 0.85;
}

.app-sidebar__foot {
  padding: 10px 16px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.app-sidebar__user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.app-sidebar__user-name {
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-sidebar__logout {
  font-size: 10.5px;
  color: rgba(255, 255, 255, 0.55);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out);
}

.app-sidebar__logout:hover {
  color: var(--brand-orange);
  border-color: var(--brand-orange);
}

.app-sidebar__brandline {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
}

.app-topbar {
  background: var(--surface-0);
  border-bottom: 1px solid var(--ink-100);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  min-height: var(--topbar-height);
}

.app-topbar__burger {
  color: var(--ink-500);
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.app-topbar__burger:hover { color: var(--ink-800); }

.app-topbar__eyebrow {
  display: none;
  font-family: var(--font-mono);
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-500);
}

.app-topbar__title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ink-900);
  margin: 0;
}

.app-topbar__divider {
  display: inline-block;
  width: 1px;
  height: 20px;
  background: var(--ink-200);
  margin: 0 4px;
}

@media (min-width: 1024px) {
  .app-topbar__eyebrow {
    display: inline;
    border-right: 1px solid var(--ink-200);
    padding-right: 12px;
    margin-right: 4px;
  }
}

.search-wrapper {
  position: relative;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f9fafb;
  border: 1px solid var(--ink-100);
  transition: background var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
  cursor: text;
}

.search-field:focus-within {
  background: #fff;
  border-color: var(--brand-orange);
  box-shadow: 0 0 0 3px rgba(241, 134, 11, 0.18);
}

.search-field__icon {
  width: 18px;
  height: 18px;
  color: var(--ink-400);
  flex-shrink: 0;
}

.search-field__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  color: var(--ink-900);
  min-width: 0;
}

.search-field__input::placeholder {
  color: var(--ink-400);
}

.search-field__kbd {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-500);
  background: #fff;
  border: 1px solid var(--ink-100);
  border-radius: 4px;
  flex-shrink: 0;
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--surface-0);
  border: 1px solid var(--ink-100);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  max-height: 380px;
  overflow-y: auto;
  z-index: 50;
}

.search-dropdown__status {
  padding: 14px 16px;
  font-size: 12.5px;
  color: var(--ink-500);
}

.search-dropdown__status--error {
  color: #b91c1c;
}

.search-result {
  display: grid;
  grid-template-columns: 86px 1fr;
  grid-template-rows: auto auto;
  align-items: baseline;
  gap: 4px 12px;
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-bottom: 1px solid var(--ink-100);
  font-family: inherit;
}

.search-result:last-child {
  border-bottom: none;
}

.search-result--active,
.search-result:hover {
  background: rgba(241, 134, 11, 0.06);
}

.search-result__type {
  grid-row: 1;
  grid-column: 1;
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand-orange);
  align-self: center;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(241, 134, 11, 0.12);
  text-align: center;
}

.search-result__title {
  grid-row: 1;
  grid-column: 2;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-900);
}

.search-result__snippet {
  grid-row: 2;
  grid-column: 2;
  font-size: 12px;
  color: var(--ink-500);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
