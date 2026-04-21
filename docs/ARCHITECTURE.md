# PROJECT_NAME Architecture

> Pre-filled met de Claudebase-standaard. Afwijkingen toevoegen in sectie **Stack** onderaan.

## Overzicht

<Architectuur in één zin. Default: monolith met gescheiden backend + frontend folders onder één repo.>

## Stack (standaard)

| Laag | Keuze | Versie |
|---|---|---|
| Frontend | Vue 3 + Vite + TypeScript + Pinia + Tailwind CSS | ^3.5 |
| Auth | Lokaal: JWT + bcrypt + `users`-tabel | jsonwebtoken ^9, bcryptjs ^2.4 |
| Backend | Express + TypeScript | ^4.19 |
| Database | SQLite (via `sql.js`, file-persist) | ^1.10 |
| Runtime | Node.js | ≥20 |
| Testing | Vitest | ^2 |
| Validatie | Zod | ^3.23 |

Zie `STACK-STANDARD.md` voor het waarom van deze keuzes.

## Stack-afwijkingen voor dit project

<Vul hier eventuele afwijkingen in + reden. Default: geen. Bij afwijking ook ADR in `docs/adr/`.>

## Dataflow

```
Browser (Vue + Pinia)
  --POST /api/auth/register-->  bcrypt-hash + INSERT users
  --POST /api/auth/login-->     verify + JWT(sub=userId)
  --GET /api/me (Bearer)-->     requireAuth middleware
                                --> Zod-validatie (waar input)
                                --> service
                                --> sql.js DB (file)
                                --> JSON response
```

## Auth

Lokale JWT-auth, geen externe provider. Flow:

1. `POST /api/auth/register` \u2014 Zod-validatie (email + min 8 char wachtwoord), bcrypt-hash, `INSERT users`, returnt `{user, token}` met 201.
2. `POST /api/auth/login` \u2014 bcrypt-compare, JWT ondertekend met `config.jwtSecret` (sub = user.id, default 7d).
3. `requireAuth` middleware (`backend/src/middleware/requireAuth.ts`) leest `Authorization: Bearer <token>`, verifieert, attacht `req.user`.
4. Frontend Pinia-store (`frontend/src/stores/auth.ts`) persist token + user in `localStorage`, axios-interceptor voegt Bearer-header toe.

Voor production: voeg rate-limit op `/auth/login`, email-verificatie, password-reset en MFA toe. Bij enterprise-context: overweeg Clerk/Auth0 (afwijking, log in sectie hieronder).

## Bestandsstructuur

```
PROJECT_NAME/
  backend/
    src/
      server.ts
      config.ts
      routes/
      services/
      db/
        connection.ts
        migrations.ts
        migrations/
          001_init.sql
    data/                 # .db bestand, niet in git
  frontend/
    src/
      main.ts
      App.vue
      router/
      stores/
      views/
      components/
      types/
      style.css
  docs/
    STACK-STANDARD.md
    MVP.md
    PROJECT-BRIEF.md
    UX-DESIGN.md
    ARCHITECTURE.md       (dit document)
    adr/
  .env                    # niet in git
  .env.example
  CLAUDE.md
  package.json            # monorepo-scripts (dev, build, test)
```

## Decisions (ADR)

Architectural Decision Records staan in `docs/adr/`. Elke niet-triviale keuze (stack-afwijking, nieuwe externe service, datamodel-doorbraak) krijgt een ADR met: Context, Decision, Consequences.

## Integraties

<Externe APIs, webhooks, file-based imports. Per integratie: doel, auth, frequentie.>

## Beveiliging

- Geheimen in `.env`, nooit in git (zie `.env.example` voor placeholders)
- `JWT_SECRET` \u2014 genereer per-omgeving een eigen waarde; server weigert production-start met default-waarde
- Parameterized SQL queries verplicht (geen string-interpolatie in `db.exec`/`db.run`)
- Input-validatie aan de rand via Zod
- CORS-config expliciet beperkt tot `CORS_ORIGINS` uit `.env`
- `/einde-sessie` kan een optionele security-scan draaien (agent + npm audit + secrets-grep)
