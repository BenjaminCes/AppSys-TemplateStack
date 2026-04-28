# Nieuw project starten met deze template

> Drie wegen, opklimmend qua effort. Lees eerst welke ingang voor jou
> werkt; sla de andere twee over.

| Ingang                    | Voor wie?                                              | Effort        | Sterkte                                       |
|---------------------------|--------------------------------------------------------|---------------|-----------------------------------------------|
| **A. Claude Code (CLI)**  | Engineers met Node + Git + Claude Code geinstalleerd   | 5 min         | Volledig geautomatiseerd, slash-commands, MVP-intake-prompts |
| **B. Claude Desktop**     | Engineers die de Claude desktop-app gebruiken          | 10-15 min     | AI-begeleiding via chat, je voert commands zelf uit |
| **C. Claude Web (claude.ai)** | Engineers zonder Claude Code, alleen browser-toegang | 15-20 min     | Volledig handmatig, AI fungeert alleen als helper voor uitleg |

**Aanbeveling: ingang A (Claude Code).** B en C werken, maar zijn een
fall-back. Slash-commands (`/start-sessie`, `/nieuw-project`,
`/einde-sessie`) bestaan alleen in Claude Code.

---

## Prereqs (alle ingangen)

Installeer eenmalig:

- **Node.js 20 LTS**: https://nodejs.org (LTS-installer, next-next-finish)
- **Git**: https://git-scm.com (default opties)
- **VS Code** met extensions: Vue (Volar), Tailwind CSS IntelliSense, ESLint
- **GitHub-account** + permissie om repos aan te maken

Verifieer in een terminal:
```bash
node --version    # v20.x
git --version
```

Maak (een keer) de Claudebase-werkmap aan:
```bash
mkdir C:/Claudebase
cd C:/Claudebase
```

---

## A. Claude Code (CLI) — aanbevolen

### A1. Eenmalige setup

Installeer Claude Code: https://docs.claude.com/claude-code (volg de
instructies voor jouw OS).

Verifieer:
```bash
claude --version
```

### A2. Skills installeren

De drie slash-commands (`/start-sessie`, `/nieuw-project`,
`/einde-sessie`) komen mee met de template. Eenmalig installeren in je
gebruikersprofiel:

```bash
git clone https://github.com/BenjaminCes/AppSys-TemplateStack
cd AppSys-TemplateStack

# Windows (PowerShell):
./onboarding/install-skills.ps1

# macOS / Linux / Git-Bash:
bash onboarding/install-skills.sh
```

Verifieer: open Claude Code in een willekeurige map en typ `/`. Je ziet
nu `/start-sessie`, `/nieuw-project` en `/einde-sessie` in de lijst.

### A3. Nieuw project scaffolden

Open Claude Code in je Claudebase-werkmap:

```bash
cd C:/Claudebase
claude
```

In de Claude Code-prompt typ:

```
/nieuw-project MyApp
```

(Vervang `MyApp` door je eigen projectnaam, PascalCase.)

De skill stelt je deze vragen, beantwoord ze:

1. **Pulse-eerst-check**: kan deze tool als Pulse-integratie?
   - Antwoord *"Standalone"* alleen als de tool echt los van Pulse moet
     leven. Bij twijfel: kies Pulse-integratie en stop hier.
2. **GitHub-URL**: maak eerst een lege repo (via `gh repo create
   <user>/MyApp --private --confirm` of in de browser op
   github.com/new), plak dan de HTTPS-URL.
3. **MVP in 1 zin**: wat doet de tool minimaal voor wie?
4. **Must-have features**: 3 tot 7 bullets.
5. **Succescriterium**: meetbaar (bv. "10 actieve gebruikers in 30
   dagen").
6. **Bewust uitgesloten** uit MVP.
7. **MVP-deadline**: yyyy-mm-dd of `geen`.
8. **Stack-bevestiging**: standaard volgen of afwijken? Bij standaard:
   doorgaan. Bij afwijken: leg de reden uit, wordt gelogd in
   `docs/ARCHITECTURE.md`.

De skill kopieert nu `_template/` naar `C:/Claudebase/MyApp/`, vult
docs in, draait `npm run install:all`, doet een eerste commit en pusht
naar GitHub.

### A4. Eerste run

Skill heeft je hierheen geleid. Test:

```bash
cd C:/Claudebase/MyApp
npm run dev
```

Backend op `http://localhost:3001`, frontend op
`http://localhost:5173`.

In de browser: log in met de seed-admin
- email: `admin@appsys.local`
- wachtwoord: `appsys00`

Je ziet de Welkom-pagina + sidebar-link `Beheerspanel` (omdat je admin
bent). Klik door naar `/admin` en zie de items + gebruikers-tabellen.

### A5. Eerste eigen route toevoegen

Drie stappen:

1. **Backend route** in `backend/src/routes/<naam>.ts`, mount in
   `backend/src/server.ts`.
2. **Frontend view** in `frontend/src/views/<Naam>View.vue`, wrap in
   `<AppShell>`.
3. **Router-entry** in `frontend/src/router/index.ts`, plus
   sidebar-link in `frontend/src/components/layout/AppShell.vue`.

Voor elke aanpassing: lint draait in de pre-commit hook, dus violations
worden direct gevangen. `npm run lint:fix` lost de meeste auto-fixable
issues op.

### A6. Sessie afsluiten

Aan het eind van je werkdag:

```
/einde-sessie
```

De skill draait `npm run lint`, `npm test`, vraagt een commit-message,
committeert + pusht.

---

## B. Claude Desktop

### B1. Eenmalige setup

- Installeer **Claude Desktop**:
  https://claude.ai/download
- Configureer **filesystem-MCP** zodat Claude bij je `C:\Claudebase`-map
  kan: zie https://docs.claude.com/desktop voor de huidige instructies
  per OS.

> Slash-commands werken **niet** in Claude Desktop. Je gebruikt Claude
> Desktop als chat-assistent die je commands geeft die je zelf in een
> terminal uitvoert.

### B2. Project scaffolden

Open een nieuwe chat in Claude Desktop en typ:

```
Ik wil een nieuw project starten op basis van de AppSys-TemplateStack.
Help me door de volgende stappen:

1. Ik heb Node 20, Git en VS Code geinstalleerd.
2. Mijn projectnaam is MyApp (PascalCase).
3. Mijn GitHub-repo is https://github.com/<user>/MyApp.git (al aangemaakt, leeg).
4. Werkmap: C:\Claudebase\

Geef me eerst de bash-commands om te clonen en te scaffolden, dan
controleren we samen of het werkt.
```

Claude geeft je een reeks commands. Voer ze uit in PowerShell of
Git-Bash. De typische sequentie:

```bash
cd C:/Claudebase
git clone https://github.com/BenjaminCes/AppSys-TemplateStack MyApp
cd MyApp
rm -rf .git README.md ONBOARDING.md MIGRATIE-bestaand-project.md NIEUW-PROJECT.md onboarding/
git init -b main
git remote add origin https://github.com/<user>/MyApp.git

# Replace PROJECT_NAME in:
#   package.json (root + backend + frontend)
#   CLAUDE.md, frontend/index.html, frontend/src/views/HomeView.vue,
#   docs/ARCHITECTURE.md, docs/MVP.md
# Vraag Claude voor de exacte sed/PowerShell-commands voor jouw OS.

cp .env.example .env
# Open .env en vul JWT_SECRET in. Genereer:
#   PowerShell: [Convert]::ToBase64String((1..32 | % {[byte](Get-Random -Max 256)}))
#   Bash: openssl rand -hex 32

npm run install:all
npm test     # 11 BE + 1 FE tests groen?
npm run lint # 0 errors?

git add -A
git commit -m "chore: initial scaffold (stack-standaard)"
git push -u origin main
```

### B3. MVP intake (handmatig)

Vul `docs/MVP.md` en `docs/PROJECT-BRIEF.md` zelf in. Vraag Claude
Desktop om je per sectie te helpen formuleren als je vastloopt.

### B4. Eerste run

```bash
npm run dev
# Login op http://localhost:5173 met admin@appsys.local / appsys00
```

### B5. Eerste eigen route

Vraag Claude Desktop:
```
Voeg een nieuwe backend-route /api/connectors toe (GET-list + POST-create),
mount in server.ts, plus een ConnectorsView.vue gewrapt in AppShell, plus
een router-entry en sidebar-link. Volg de patterns uit deze codebase
(toon eerst items.ts als voorbeeld).
```

Claude leest je bestaande code en geeft je diffs. Pas ze toe in VS
Code, run `npm run lint`, fix wat nodig is, commit + push.

---

## C. Claude Web (claude.ai)

### C1. Beperking

Claude Web heeft **geen toegang** tot je lokale filesystem of terminal.
Je gebruikt Claude als chat-assistent voor uitleg en code-snippets, je
voert alles handmatig uit.

### C2. Project scaffolden (manueel)

Open een terminal:

```bash
cd C:/Claudebase
git clone https://github.com/BenjaminCes/AppSys-TemplateStack MyApp
cd MyApp

# Verwijder template-only bestanden
rm -rf .git README.md ONBOARDING.md MIGRATIE-bestaand-project.md NIEUW-PROJECT.md onboarding/

# Reinitialiseer git als jouw repo
git init -b main
git remote add origin https://github.com/<user>/MyApp.git

# Vervang PROJECT_NAME in alle relevante bestanden (PowerShell)
$files = @(
  "package.json",
  "backend/package.json",
  "frontend/package.json",
  "CLAUDE.md",
  "frontend/index.html",
  "frontend/src/views/HomeView.vue",
  "docs/ARCHITECTURE.md",
  "docs/MVP.md"
)
foreach ($f in $files) {
  (Get-Content $f) -replace 'PROJECT_NAME', 'MyApp' | Set-Content $f
}

# .env aanmaken
copy .env.example .env
# Genereer JWT_SECRET en plak in .env:
[Convert]::ToBase64String((1..32 | % {[byte](Get-Random -Max 256)}))

# Install + test + lint
npm run install:all
npm test
npm run lint

# Eerste commit
git add -A
git commit -m "chore: initial scaffold (stack-standaard)"
git push -u origin main
```

(Bash-equivalent: vervang PowerShell-commands door `sed -i 's/PROJECT_NAME/MyApp/g'`
en `openssl rand -hex 32`.)

### C3. MVP intake

Open `docs/MVP.md` en `docs/PROJECT-BRIEF.md` in VS Code en vul ze in.
Open een chat op claude.ai en vraag bv.:

```
Ik werk aan MyApp. Help me het MVP-document scherp formuleren. Het
template heeft secties Probleem, Oplossing, Must-haves, Succescriterium,
Niet-MVP, Deadline. Help me per sectie met 1-2 vragen om te scherpen.
```

### C4. Eerste run

```bash
npm run dev
# Login op http://localhost:5173 met admin@appsys.local / appsys00
```

### C5. Eerste eigen route

Op claude.ai, deel relevante bestanden door ze te plakken (bv.
`backend/src/routes/items.ts` als voorbeeld) en vraag Claude om een
analoge route voor jouw domein. Pas de gegenereerde code handmatig toe
in VS Code.

---

## Wat je in elk geval krijgt

Onafhankelijk van de gekozen ingang heb je na deze guide:

| Onderdeel | Status |
|---|---|
| Werkende auth (register + login + me) | direct |
| Seed-admin `admin@appsys.local` / `appsys00` | direct |
| RBAC met admin/user-rol | direct |
| Beheerspanel op `/admin` (admin-only) | direct |
| AppSys-huisstijl (navy + oranje + groen + hartslag-logo) | direct |
| AppShell met sidebar + topbar + Ctrl+K-search | direct |
| ESLint die externe UI-libs en niet-brand kleur-classes blokkeert | direct |
| Pre-commit hook (em-dashes, hex-codes, kleur-classes, ESLint) | direct na install |
| Items + search demo als voorbeeld-pattern | direct |

---

## Verplichte vervolgacties

Na de eerste run, voor je echt gaat bouwen:

1. **Wijzig admin-wachtwoord** als je naar production deployt. `appsys00`
   is een bewust bekende lokale default.
2. **Vul `docs/MVP.md` en `docs/PROJECT-BRIEF.md`** in. Zonder dit
   weet niemand (jij of een collega) waar dit project naartoe gaat.
3. **Lees `docs/STACK-STANDARD.md`** secties 1 en 2 zodat je weet
   waarom de stack is wat hij is en wanneer je mag afwijken.
4. **Lees `docs/UX-DESIGN.md`** zodat je geen huisstijl-violations
   schrijft die de pre-commit hook later toch tegen je gebruikt.

---

## Vragen of hulp

- Issues: https://github.com/BenjaminCes/AppSys-TemplateStack/issues
- Voor diepere stack-keuzes: lees `docs/STACK-STANDARD.md` voordat je
  een afwijking voorstelt.
