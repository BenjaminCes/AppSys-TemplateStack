# PROJECT_NAME, Development Guidelines

> Ingevuld tijdens `/start-sessie` (mode A) of `/nieuw-project`. Volg `docs/STACK-STANDARD.md` als hoofdregel.

## Project Overview

<1-2 zinnen: wat doet dit project, voor welke doelgroep.>

## Stack

Volgt de Claudebase-standaard. Zie `docs/STACK-STANDARD.md` voor de volledige tabel. Afwijkingen (indien toegestaan) worden gelogd in `docs/ARCHITECTURE.md#Stack`.

- Frontend: Vue 3 + Vite + TypeScript + Pinia + Tailwind CSS
- Auth: Clerk
- Backend: Express + TypeScript (port 3001)
- Database: SQLite via `sql.js` (file-persist op `backend/data/app.db`)
- Testing: Vitest (backend + frontend)

## Structure

- `backend/`, Express API op port 3001
- `frontend/`, Vue 3 + Vite op port 5173
- `docs/`, STACK-STANDARD.md, MVP.md, PROJECT-BRIEF.md, UX-DESIGN.md, ARCHITECTURE.md
- `.env`, geheimen (nooit committen, zie `.env.example`)

## Commands

- Dev beide: `npm run dev` (root)
- Build: `npm run build`
- Test: `npm test` (backend + frontend)
- Typecheck: `npm run typecheck`

## GitHub

- Remote: `<https://github.com/...>`
- Branch-strategie: direct naar `main`, kort en vaak committen
- Commit-stijl: Engels, imperatief, 50 char subject, geen em-dashes

## Conventies

- **Taal UI + docs**: Nederlands
- **Taal code + commits**: Engels
- **Geen em-dashes** (U+2014) in code, UI, docs, AI-prompts
- **Geheimen**: `.env`, `*.key`, `secrets/` niet committen
- **Validatie**: input aan de rand van het systeem (Zod bij routes), parameterized SQL queries

## Sessie-workflow

- Begin elke sessie met `/start-sessie`
- Eind elke sessie met `/einde-sessie` (optioneel: security-scan)
