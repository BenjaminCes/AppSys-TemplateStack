# Stack-Standaard (Claudebase)

> Dit document is de bron-van-waarheid voor de gekozen stack binnen elk Claudebase-project. Afwijken kan, maar enkel met expliciete reden + logging in `ARCHITECTURE.md`.

## 1. De standaard

| Laag | Keuze | Versie-hint |
|---|---|---|
| Frontend | Vue 3 + Vite + TypeScript + Pinia + Tailwind CSS | Vue ^3.5, Vite ^5, Tailwind ^3.4 |
| Auth | Lokaal: JWT + bcrypt + `users`-tabel (zie `backend/src/services/authService.ts`) | jsonwebtoken ^9, bcryptjs ^2.4 |
| RBAC | `role`-kolom op users (admin/user), `requireRole`-middleware | Migration `003_users_role.sql` + `004_seed_admin.sql` |
| Backend | Express + TypeScript (port 3001) | Express ^4.19, ts-node-dev voor dev |
| Database | SQLite via `sql.js` (file-persistent op disk) | sql.js ^1.10 |
| Migrations | Eigen runner (`backend/src/db/migrations.ts`), `.sql`-files | n.v.t. |
| Validatie | Zod bij routes en request-bodies | ^3.23 |
| Testing | Vitest (backend + frontend) | ^2 |
| Lint | ESLint (root + frontend + backend configs), faalt commit | ^8 |
| Pre-commit hook | `scripts/git-hooks/pre-commit` (em-dash, hex, kleur-classes, ESLint) | n.v.t. |
| Package manager | npm | >=10 |
| Hosting | GitHub (direct-push op `main` voor MVP, feature-branch + PR voor groter werk) | n.v.t. |
| Taal UI + docs | Nederlands | n.v.t. |
| Taal code + commits | Engels, imperatief, 50 char subject | n.v.t. |
| UI-design | Zie `UX-DESIGN.md`, AppShell verplicht | n.v.t. |

Poort-conventie: backend `3001`, frontend dev-server `5173`. `/api` op de frontend proxyt naar `http://localhost:3001`.

## 2. Niet toegestaan zonder ADR

Externe UI-libraries veranderen de hele look-and-feel en haken ESLint
`no-restricted-imports` af. Zonder ADR + onderbouwing in
`ARCHITECTURE.md`: geweigerd.

- `vuetify`, `bootstrap`, `primevue`, `quasar`, `element-plus`, `naive-ui`, `ant-design-vue`
- `@mui/*`, `@chakra-ui/*`
- CSS-in-JS bibliotheken: `styled-components`, `@emotion/*`
- Component-libraries die hun eigen design-systeem opleggen

Bouw eigen componenten in `frontend/src/components/` met de huisstijl-tokens.

## 3. Wanneer afwijken (technische lagen)

**Gerechtvaardigd** (documenteren in ARCHITECTURE.md + kort ADR in `docs/adr/`):
- Postgres i.p.v. SQLite: bij verwachte concurrent-writes > 10 rps of data-volume > 1 GB.
- React i.p.v. Vue: als het team/klant expliciet React-expertise inbrengt.
- Fastify i.p.v. Express: alleen bij aantoonbare hot-path-perf behoefte (> 5k req/s).
- Playwright/Cypress: als er echte E2E-coverage nodig is bovenop Vitest.
- Clerk / Auth0 / SSO i.p.v. lokale JWT-auth: bij enterprise-context (SAML/OIDC-vereiste, centraal gebruikersbeheer, MFA-verplichting).

**Niet gerechtvaardigd** (wordt geweigerd):
- "Ik vind X leuker, moderner of populairder op HN".
- Bun/Deno als runtime: te jong, breekt Clerk/sql.js nog regelmatig.
- NoSQL (MongoDB, DynamoDB) voor relationele data.
- Custom auth-systeem i.p.v. de meegeleverde JWT/bcrypt-implementatie.
- Tailwind vervangen door CSS-in-JS.

## 4. Pulse-first-regel

Nieuwe tools horen **eerst** als Pulse-integratie te komen (web-UI + REST). Alleen als de tool echt standalone moet draaien (eigen deployment, geen overlap met Pulse) wordt een apart Claudebase-project gescaffold.

Vragen voor de gebruiker voor scaffold:
1. Is dit echt standalone, of kan het in Pulse?
2. Zo standalone: waarom?

## 5. AI-gedragsregel bij afwijking

Wanneer een gebruiker tijdens werk vraagt om iets niet-standaard (`npm install fastify`, `prisma init`, `bun run ...`, toevoegen van een andere UI-framework): de assistent reageert met:

```
[!] Dit wijkt af van STACK-STANDARD.md (<laag>).
Voordeel standaard: <1 zin, bv. "een codebase-patroon in het hele bedrijf, minder onboarding-tijd">.
Bevestig dat je wil afwijken, anders gebruik ik de standaard (<aanbeveling>).
```

Pas na expliciete bevestiging voert de assistent de afwijkende actie uit, en logt ze de afwijking in `docs/ARCHITECTURE.md#Stack`.
