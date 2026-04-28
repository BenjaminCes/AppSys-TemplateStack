# AppSys Stack-Standaard (Claudebase-template)

> Bedrijfsstandaard scaffold voor interne projecten bij AppSys. Vue 3 +
> Express + SQLite + Vitest met lokale JWT-auth, RBAC en huisstijl
> ingebakken. Wordt gekloond, gescaffold, en via drie Claude
> Code-skills (`/start-sessie`, `/nieuw-project`, `/einde-sessie`)
> bediend. Een engineer is binnen 45 minuten productief, zonder
> voorkennis en zonder pre-installed tools.

---

## Snel kiezen

| Ik wil... | Lees |
|---|---|
| Een **nieuw** project starten | [`NIEUW-PROJECT.md`](./NIEUW-PROJECT.md) |
| Een **bestaand** project upgraden naar deze versie | [`MIGRATIE-bestaand-project.md`](./MIGRATIE-bestaand-project.md) |
| 45-min onboarding-checklist voor de hele toolchain | [`ONBOARDING.md`](./ONBOARDING.md) |

---

## Wat krijg je?

| Laag | Keuze |
|---|---|
| Frontend | Vue 3 + Vite + TypeScript + Pinia + Tailwind CSS |
| Auth | Lokaal: JWT + bcrypt + `users`-tabel (register/login/me scaffold) |
| RBAC | `role`-kolom (admin/user) + `requireRole`-middleware |
| Backend | Express + TypeScript (port 3001) |
| Database | SQLite via `sql.js` (file-persist) |
| Validatie | Zod |
| Testing | Vitest + supertest |
| Lint + format | ESLint (root + FE + BE) + pre-commit hook |
| Package manager | npm |

**Ingebakken huisstijl** (raak je niet kwijt na een verkeerde edit):
- Brand-tokens `brand.{navy,orange,cyan,green}` in `tailwind.config.js`.
- AppShell met sidebar + topbar + hartslag-logo + Ctrl+K-search.
- Inter / Inter Tight / JetBrains Mono fonts.

**Ingebakken guardrails**:
- ESLint blokkeert imports van externe UI-libs (`vuetify`, `bootstrap`,
  `primevue`, `quasar`, `@mui/*`, `@chakra-ui/*`, `element-plus`,
  `naive-ui`, `ant-design-vue`).
- Pre-commit hook weigert em-dashes, curly quotes, AI-tell-emojis,
  hex-codes buiten CSS, niet-brand Tailwind kleur-classes en
  ESLint-errors.
- Hook activeert automatisch via `postinstall` na `npm install`.

**Ingebakken admin**:
- Seed-account `admin@appsys.local` / `appsys00`.
- `/admin` route met items + gebruikers-tabel, admin-only via router-guard.

Mappenboom:

```
_template/
  backend/                 Express + TS + sql.js
    .eslintrc.cjs          blokkeert template-literal-SQL
    src/
      routes/              health, auth, me, items, search, admin
      services/            authService (incl. role)
      middleware/          requireAuth, requireRole
      db/                  connection + migrations (incl. seed-admin)
  frontend/                Vue 3 + Vite + Pinia + Tailwind
    .eslintrc.cjs          blokkeert externe UI-libs en niet-brand classes
    public/brand/          hartslag-logo + favicon
    src/
      api/client.ts        axios instance + Bearer-interceptor
      components/layout/   AppShell.vue (sidebar + topbar + search)
      stores/              auth + items
      views/               Home, Login, Register, Admin
      style.css            CSS-tokens (--brand-*, --surface-*, --ink-*)
  docs/                    STACK-STANDARD, UX-DESIGN, style-guide, MVP, ARCHITECTURE
  scripts/git-hooks/       pre-commit + README
  onboarding/              install-skills + Claude Code skills + agents
  index.html               standalone huisstijl-preview (open via file://)
  .env.example             vul JWT_SECRET aan
  package.json             monorepo scripts + postinstall (hook-activatie)
```

---

## Quickstart (10 min, na prereqs)

```bash
git clone https://github.com/BenjaminCes/AppSys-TemplateStack
cd AppSys-TemplateStack

# 1. Dependencies (backend + frontend + root)
npm run install:all
# postinstall activeert de pre-commit hook automatisch.

# 2. Env-file
cp .env.example .env
# Open .env en vul JWT_SECRET in. Genereer:
#   PowerShell:  [Convert]::ToBase64String((1..32 | % {[byte](Get-Random -Max 256)}))
#   macOS/Linux: openssl rand -hex 32

# 3. Beide servers opstarten
npm run dev
# -> backend: http://localhost:3001
# -> frontend: http://localhost:5173

# 4. Login op http://localhost:5173
#    email:    admin@appsys.local
#    password: appsys00

# 5. Tests + lint
npm test
npm run lint
```

Werkt alles? Je hebt een werkend scaffold met huisstijl-AppShell,
RBAC, admin-login, en pre-commit-guardrails.

> Bekijk `index.html` op toplevel (open in browser) voor een
> standalone preview van de huisstijl zonder npm-install.

---

## Prereqs

Installeer eenmalig:

- **Node.js 20 LTS**: https://nodejs.org
- **Git**: https://git-scm.com
- **VS Code** met extensions: Vue (Volar), Tailwind CSS IntelliSense, ESLint
- (Aanbevolen) **Claude Code CLI**: https://docs.claude.com/claude-code

Voor de volledige 45-min onboarding: [`ONBOARDING.md`](./ONBOARDING.md).

---

## Claude Code workflow (aanbevolen)

Drie slash-commands begeleiden je:

| Command | Wat doet het? |
|---|---|
| `/start-sessie` | Begin werkdag. Detecteert mode (leeg / scaffolded / bestaand), draait git-status-check, MVP-intake bij nieuwe projecten. |
| `/nieuw-project` | Scaffold nieuw project vanuit deze template onder `C:\Claudebase\<naam>\`. Pulse-eerst-check, GitHub-URL, MVP-intake. |
| `/einde-sessie` | Einde werkdag. Lint + tests + optionele security-scan + commit + push. |

### Skills installeren (eenmalig)

Open de gekloonde template-folder en draai het install-script:

```bash
# Windows (PowerShell):
./onboarding/install-skills.ps1

# macOS / Linux / Git-Bash:
bash onboarding/install-skills.sh
```

Verifieer: open Claude Code en typ `/`. Je ziet `/start-sessie`,
`/nieuw-project` en `/einde-sessie`.

---

## Auth + RBAC in de template

| Rol  | Email                | Wachtwoord  | Notitie |
|------|----------------------|-------------|---------|
| Admin| `admin@appsys.local` | `appsys00`  | Seed via migration `004_seed_admin.sql`. Wijzig direct in production. |
| User | (registreer zelf)    | min 8 chars | Default-rol bij register is `user`. |

Endpoints:
- `POST /api/auth/register` (publiek): maak een user-account.
- `POST /api/auth/login`: returnt `{user, token}` met `role`.
- `GET /api/me` (protected): returnt huidige user + role.
- `GET /api/admin/users` (admin-only): list alle users.

Frontend:
- `auth.isAdmin` getter in `stores/auth.ts`.
- Router-guard: `meta: { requiresRole: 'admin' }` op admin-routes.
- AppShell-sidebar `Beheer`-sectie alleen zichtbaar voor admins.

Voor production: rate-limit op `/auth/login`, password-reset-flow,
email-verificatie. Bij enterprise: overweeg Clerk of Auth0 (zie
`docs/STACK-STANDARD.md` sectie 3).

---

## Conventies

- **Taal UI + docs**: Nederlands. **Code + commits**: Engels.
- **Geen em-dashes** (U+2014) in code, UI of commits. Pre-commit hook
  blokkeert.
- **Geen externe UI-libs** zonder ADR. ESLint blokkeert.
- **Alleen `brand.*` Tailwind-tokens** voor kleuren (plus `gray-*`,
  `slate-*`, `red-*` voor errors). Pre-commit hook scant.
- **Parameterized SQL**: alleen `?`-placeholders, nooit string-concat
  in `db.run` / `db.exec`. ESLint blokkeert template-literal-SQL.
- **Zod** aan de route-rand (request-body, query-params).
- **`.env`** nooit committen (gitignore dekt dit); `.env.example` als
  template. **JWT_SECRET** per omgeving uniek.

Volledige UX-regels: [`docs/UX-DESIGN.md`](./docs/UX-DESIGN.md).
Schrijfregels: [`docs/style-guide.md`](./docs/style-guide.md).

---

## Docs wegwijs

| Bestand | Wat |
|---|---|
| [`NIEUW-PROJECT.md`](./NIEUW-PROJECT.md) | Drie wegen om een nieuw project te starten (Code / Desktop / Web) |
| [`MIGRATIE-bestaand-project.md`](./MIGRATIE-bestaand-project.md) | Upgrade-guide voor bestaande forks |
| [`ONBOARDING.md`](./ONBOARDING.md) | 45-min checklist voor nieuwe engineer |
| [`docs/STACK-STANDARD.md`](./docs/STACK-STANDARD.md) | Waarom deze stack + afwijkings-regels |
| [`docs/UX-DESIGN.md`](./docs/UX-DESIGN.md) | Design-principes + visual language + AppShell-regel |
| [`docs/style-guide.md`](./docs/style-guide.md) | Schrijfregels (em-dashes, quotes, emoji's) |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Technisch overzicht (stack, dataflow, auth, structuur) |
| [`docs/MVP.md`](./docs/MVP.md) | Template voor MVP-intake (wordt gevuld in `/start-sessie`) |
| [`docs/PROJECT-BRIEF.md`](./docs/PROJECT-BRIEF.md) | Stakeholders, tijdlijn, risico's |
| [`CLAUDE.md`](./CLAUDE.md) | Per-project guidelines voor Claude Code |
| [`scripts/git-hooks/README.md`](./scripts/git-hooks/README.md) | Pre-commit hook details + bypass |

---

## Support

- Team-lead: Benjamin Ceyssens, `benjamin.ceyssens@appsysictgroup.com`
- Issues: https://github.com/BenjaminCes/AppSys-TemplateStack/issues
- Stack-keuze-vragen: lees `docs/STACK-STANDARD.md` sectie 2 voor je
  afwijkt.
