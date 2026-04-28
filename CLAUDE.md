# PROJECT_NAME, Development Guidelines

> Ingevuld tijdens `/start-sessie` (mode A) of `/nieuw-project`. Volg
> `docs/STACK-STANDARD.md` als hoofdregel; afwijkingen vereisen een ADR.

## Project Overview

<1-2 zinnen: wat doet dit project, voor welke doelgroep.>

## Stack

Volgt de Claudebase-standaard. Zie `docs/STACK-STANDARD.md` voor de volledige
tabel. Afwijkingen worden gelogd in `docs/ARCHITECTURE.md#Stack`.

- Frontend: Vue 3 + Vite + TypeScript + Pinia + Tailwind CSS
- Auth: lokaal (JWT + bcrypt, users-tabel) - zie `backend/src/services/authService.ts`
- Backend: Express + TypeScript (port 3001)
- Database: SQLite via `sql.js` (file-persist op `backend/data/app.db`)
- Testing: Vitest (backend + frontend)

## Structure

- `backend/`, Express API op port 3001
- `frontend/`, Vue 3 + Vite op port 5173
- `docs/`, STACK-STANDARD.md, MVP.md, PROJECT-BRIEF.md, UX-DESIGN.md, ARCHITECTURE.md, style-guide.md
- `scripts/git-hooks/`, pre-commit-hook (em-dash, hex, ESLint)
- `.env`, geheimen (nooit committen, zie `.env.example`)

## Commands

- Dev beide: `npm run dev` (root)
- Build: `npm run build`
- Test: `npm test`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint` (faalt commit als er errors zijn)
- Lint-fix: `npm run lint:fix`

## GitHub

- Remote: `<https://github.com/...>`
- Branch-strategie: direct naar `main`, kort en vaak committen
- Commit-stijl: Engels, imperatief, 50 char subject, geen em-dashes

## Huisstijl (hard requirement)

1. **AppShell verplicht** voor elke ingelogde view. Bron:
   `frontend/src/components/layout/AppShell.vue`. Auth-views (`/login`,
   `/register`) staan buiten AppShell.
2. **Alleen `brand.*` Tailwind-tokens** voor kleuren. Hex-codes mogen
   uitsluitend in `tailwind.config.js`, `style.css`, `public/brand/*` en
   binnen `<style>...</style>`-blokken van `.vue`-files staan (dat is CSS).
   In `<template>`/`<script>` van .vue en in `.ts/.tsx` is hex verboden.
3. **Geblokkeerde Tailwind-kleur-classes**: alle `(bg|text|border|...)-(orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-N`. Toegestaan: `brand.*`, `gray-*`, `slate-*`, `red-*` (alleen voor error-states), `white`, `black`, `transparent`, `current`.
4. **Fonts**: Inter (body), Inter Tight (display), JetBrains Mono (data/code). Geen andere font-families zonder UX-DESIGN-update.
5. **Iconen**: Heroicons stroke (24x24, stroke-width 2). Geen Lucide of Material Icons.
6. **Verboden**: bliksemschicht-iconen (`BoltIcon`, `LightningBoltIcon`,
   `ZapIcon`), AI-tell-emojis (lightbulb, sparkles, rocket, fire, star,
   check-box, cross-box, heavy-check, warn). Pre-commit hook blokkeert.
7. **Externe UI-libs verboden zonder ADR**: `vuetify`, `bootstrap`,
   `primevue`, `quasar`, `@mui/*`, `@chakra-ui/*`, `element-plus`,
   `naive-ui`, `ant-design-vue`. ESLint `no-restricted-imports` blokkeert.

Zie `docs/UX-DESIGN.md` voor het volledige design-systeem.

## RBAC-pattern

Auth-laag heeft twee rollen: `admin` en `user`.

- **Backend**: `backend/src/middleware/requireRole.ts` is een factory.
  Routes die admin-only zijn:
  ```ts
  router.get('/path', requireAuth, requireRole('admin'), handler)
  ```
- **Frontend router**: voeg `meta: { requiresRole: 'admin' }` toe; de
  `beforeEach`-guard in `router/index.ts` redirect non-admins naar `/`.
- **AppShell**: render admin-only sidebar-items binnen
  `<template v-if="auth.isAdmin">`.
- **Default seed**: `admin@appsys.local` / `appsys00` (migration `004_seed_admin.sql`).
  Voor production: wachtwoord direct wijzigen na eerste login.

Zie `backend/src/middleware/requireRole.ts` en
`frontend/src/stores/auth.ts` (`isAdmin` getter).

## Quality gates

1. **ESLint** runt op `npm run lint` en in pre-commit. Errors blokkeren
   commit. Configs: `.eslintrc.cjs` (root), `frontend/.eslintrc.cjs`,
   `backend/.eslintrc.cjs`.
2. **Pre-commit hook** (`scripts/git-hooks/pre-commit`) blokkeert:
   em-dashes (U+2014), curly quotes (U+201C/D, U+2018/9), AI-tell-emojis,
   hardcoded hex-codes in `.vue/.ts`, geblokkeerde Tailwind-kleur-classes,
   ESLint-errors.
3. **Activatie**: postinstall in root `package.json` zet
   `git config core.hooksPath scripts/git-hooks` na `npm install`. Niets
   manueel nodig.

## Sessie-workflow

- Begin elke sessie met `/start-sessie` (detecteert mode A/B/C).
- Eind elke sessie met `/einde-sessie` (lint + tests + optionele
  security-scan + commit + push).
- Nieuw project: `/nieuw-project` (Pulse-first-check + scaffold + MVP-intake).

Skills staan in `onboarding/skills/`; installeer via
`onboarding/install-skills.{ps1,sh}`.

## Conventies

- **Taal UI + docs**: Nederlands.
- **Taal code + commits**: Engels.
- **Geen em-dashes** (U+2014) in code, UI, docs, AI-prompts. Zie
  `docs/style-guide.md`.
- **Geheimen**: `.env`, `*.key`, `secrets/` niet committen.
- **Validatie**: input aan de rand van het systeem (Zod bij routes),
  parameterized SQL queries (geen template-literals in `db.prepare`).

## AI-output-regels

- AI-output mag nooit em-dashes, curly quotes of bliksemschicht-iconen
  bevatten. Voeg altijd toe aan elke LLM-call de systeem-regel: *"Gebruik
  NOOIT een em-dash. Gebruik komma, dubbele punt, of en-dash (U+2013)."*
- Persisteer AI-output nooit zonder user-review (`review_status='pending'`
  patroon, user keurt goed in UI).
