# AppSys Stack-Standaard (Claudebase-template)

> Bedrijfsstandaard scaffold voor interne projecten bij AppSys. Vue 3 + Express + SQLite + Vitest met lokale JWT-auth. Wordt gekloond, gescaffold, en via drie Claude Code-skills (`/start-sessie`, `/nieuw-project`, `/einde-sessie`) bediend. Eenmaal geinstalleerd kan een engineer binnen 45 minuten productief zijn \u2014 zonder voorkennis en zonder pre-installed tools.

---

## Wat krijg je?

| Laag | Keuze |
|---|---|
| Frontend | Vue 3 + Vite + TypeScript + Pinia + Tailwind CSS |
| Auth | Lokaal: JWT + bcrypt + `users`-tabel (register/login/me scaffold) |
| Backend | Express + TypeScript (port 3001) |
| Database | SQLite via `sql.js` (file-persist) |
| Validatie | Zod |
| Testing | Vitest + supertest |
| Package manager | npm |

Mappenboom:

```
_template/
  backend/                 Express + TS + sql.js
    src/
      routes/              health, auth, me
      services/            authService
      middleware/          requireAuth
      db/                  connection + migrations
  frontend/                Vue 3 + Vite + Pinia + Tailwind
    src/
      api/client.ts        axios instance + Bearer-interceptor
      stores/auth.ts       Pinia auth store (localStorage persist)
      views/               Home, Login, Register
  docs/                    STACK-STANDARD, MVP, ARCHITECTURE, ...
  onboarding/              Claude Code skills + agents snapshot + install-scripts
  .env.example             vul JWT_SECRET aan
  package.json             monorepo scripts (dev, build, test, install:all)
```

---

## Prereqs

Installeer eenmalig op je machine:

- **Node.js 20 LTS** \u2014 https://nodejs.org
- **Git** \u2014 https://git-scm.com
- **Claude Code CLI** \u2014 https://docs.claude.com/claude-code
- Editor: **VS Code** aanbevolen met extensions: Vue (Volar), Tailwind CSS IntelliSense, ESLint

Werk je van nul? Volg `ONBOARDING.md` \u2014 afvinkbare 45-minuten-checklist.

---

## Quickstart (10 min)

```bash
git clone https://github.com/BenjaminCes/AppSys-TemplateStack
cd AppSys-TemplateStack

# 1. Dependencies (backend + frontend + root)
npm run install:all

# 2. Env-file
cp .env.example .env
# Open .env en vul JWT_SECRET in. Genereer een eigen secret:
#   PowerShell:  [Convert]::ToBase64String((1..32 | % {[byte](Get-Random -Max 256)}))
#   macOS/Linux: openssl rand -hex 32

# 3. Beide servers opstarten
npm run dev
# -> backend: http://localhost:3001
# -> frontend: http://localhost:5173

# 4. Ga naar http://localhost:5173
#    Klik "Registreren", maak een test-account, log in.

# 5. Tests draaien
npm test
```

Als alles werkt: je hebt een werkend scaffold met login/logout-flow en een protected `/api/me` endpoint.

---

## Claude Code workflow (verplicht)

Binnen AppSys werken we altijd met drie slash-commands in Claude Code. Ze begeleiden je door het begin, het einde en het scaffolden van een sessie.

| Command | Wat doet het? |
|---|---|
| `/start-sessie` | Begin van je werkdag. Detecteert of je een leeg project, half-ingevulde scaffold of bestaand project hebt. Vraagt MVP-intake + stack-bevestiging bij nieuwe projecten, git-status-check bij bestaande. |
| `/einde-sessie` | Einde van je werkdag. Draait tests, biedt optionele security-scan (npm audit + secrets-grep + Claude-agent), vraagt commit-message, committeert, pusht naar GitHub. |
| `/nieuw-project` | Scaffold een nieuw project vanuit deze template onder `C:\Claudebase\<naam>\`. Vraagt om GitHub-URL, vult MVP-docs, initialiseert git. |

### Skills eenmalig installeren

De skills + de `security-scan` agent staan in `onboarding/`. Je installeert ze in je eigen `~/.claude/` zodat Claude Code ze herkent:

**Windows (PowerShell):**
```powershell
./onboarding/install-skills.ps1
```

**macOS / Linux / Git-Bash:**
```bash
bash onboarding/install-skills.sh
```

Verificatie: open Claude Code en typ `/` \u2014 je ziet nu `/start-sessie`, `/einde-sessie` en `/nieuw-project` in de lijst. Typ `/start-sessie` en de skill start.

> Heb je lokale wijzigingen in `~/.claude/skills/<naam>/`? Maak eerst een back-up \u2014 het script overschrijft met `-Force`.

---

## Nieuw project scaffolden

### Aanbevolen (met Claude Code)

```
/nieuw-project MyApp
```

Volg de prompts (GitHub-URL, MVP-vragen, stack-bevestiging). Eindresultaat: werkend repo op GitHub met een eerste commit.

### Handmatig

```bash
cp -r _template/. C:/Claudebase/MyApp/
cd C:/Claudebase/MyApp/
rm -rf onboarding README.md ONBOARDING.md    # deze horen niet in een scaffolded project
git init -b main
git remote add origin https://github.com/<user>/<repo>.git
```

Vervang daarna `PROJECT_NAME` door je echte projectnaam in:
- `package.json` (root + backend + frontend)
- `CLAUDE.md`
- `frontend/index.html`
- `frontend/src/views/HomeView.vue`
- `docs/ARCHITECTURE.md`
- `docs/MVP.md`

Commit + push:
```bash
npm run install:all
npm test
git add -A
git commit -m "chore: initial scaffold (stack-standaard)"
git push -u origin main
```

---

## Auth in de template

Uit de doos werkt er een volwaardige lokale auth:

- **Users-tabel** \u2014 `email` (uniek) + `password_hash` (bcrypt).
- **Register / Login** \u2014 `POST /api/auth/register`, `POST /api/auth/login`. Returnt `{user, token}`.
- **JWT** \u2014 ondertekend met `JWT_SECRET` uit `.env`, default expiry 7 dagen (`JWT_EXPIRES_IN`).
- **Middleware** \u2014 `requireAuth` op protected routes, leest `Authorization: Bearer <token>`.
- **Voorbeeld** \u2014 `GET /api/me` is protected; `GET /api/health` is public.
- **Frontend** \u2014 Pinia-store persist token in `localStorage`, axios-interceptor voegt Bearer-header toe, router-guard stuurt niet-ingelogde bezoekers naar `/login`.

**Voor production voeg toe:** rate-limit op `/auth/login`, password-reset-flow, email-verificatie, optioneel MFA. De default-stack is een startpunt, niet end-state. Zie `docs/ARCHITECTURE.md#Auth`.

Bij enterprise-context (SAML/OIDC / centraal gebruikersbeheer): overweeg Clerk of Auth0 \u2014 dat is een gerechtvaardigde afwijking, zie `docs/STACK-STANDARD.md#2-wanneer-afwijken`.

---

## Conventies

- **Taal UI + docs**: Nederlands | **code + commits**: Engels
- **Geen em-dashes** (U+2014) in code, UI of commits
- **Commits**: imperatief, 50 char subject, conventional (feat/fix/chore/docs/refactor)
- **Branch-strategie**: direct op `main` voor MVP, feature-branch + PR voor groter werk
- **Parameterized SQL**: uitsluitend `?`-placeholders, nooit string-concat in `db.run`/`db.exec`
- **Zod** aan de route-rand (request-body, query-params)
- **`.env`** nooit committen (gitignore dekt dit); `.env.example` als template
- **JWT_SECRET** per omgeving uniek; default-waarde faalt de production-start

---

## Docs wegwijs

| Bestand | Wat |
|---|---|
| [`ONBOARDING.md`](./ONBOARDING.md) | 45-min checklist voor nieuwe engineer |
| [`docs/STACK-STANDARD.md`](./docs/STACK-STANDARD.md) | Waarom deze stack + afwijkings-regels |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Technisch overzicht (stack, dataflow, auth, structuur) |
| [`docs/MVP.md`](./docs/MVP.md) | Template voor MVP-intake (wordt gevuld in `/start-sessie`) |
| [`docs/PROJECT-BRIEF.md`](./docs/PROJECT-BRIEF.md) | Stakeholders, tijdlijn, risico's |
| [`docs/UX-DESIGN.md`](./docs/UX-DESIGN.md) | Design-principes + visual language |
| [`CLAUDE.md`](./CLAUDE.md) | Per-project guidelines voor Claude Code |

---

## Support

- Team-lead: Benjamin Ceyssens \u2014 `benjamin.ceyssens@appsysictgroup.com`
- Issues: https://github.com/BenjaminCes/AppSys-TemplateStack/issues
- Vragen over de stack-keuze: zie `docs/STACK-STANDARD.md` sectie 2 voordat je afwijkt.
