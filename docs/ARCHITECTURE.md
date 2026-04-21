# PROJECT_NAME Architecture

> Pre-filled met de Claudebase-standaard. Afwijkingen toevoegen in sectie **Stack** onderaan.

## Overzicht

<Architectuur in één zin. Default: monolith met gescheiden backend + frontend folders onder één repo.>

## Stack (standaard)

| Laag | Keuze | Versie |
|---|---|---|
| Frontend | Vue 3 + Vite + TypeScript + Pinia + Tailwind CSS | ^3.5 |
| Auth | Clerk (`@clerk/vue`, `@clerk/backend`) | latest |
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
Browser (Vue + Clerk) --HTTPS--> /api/* proxy --> Express route
                                               --> Zod-validatie
                                               --> service
                                               --> sql.js DB (file)
                                               --> JSON response
```

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
- Parameterized SQL queries verplicht (geen string-interpolatie in `db.exec`/`db.run`)
- Input-validatie aan de rand via Zod
- CORS-config expliciet beperkt tot `CORS_ORIGINS` uit `.env`
- `/einde-sessie` kan een optionele security-scan draaien (agent + npm audit + secrets-grep)
