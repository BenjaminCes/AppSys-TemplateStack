---
name: start-sessie
description: Begin een werksessie op een Claudebase-project. Detecteert automatisch of het een leeg project is (scaffold + MVP-intake + stack-bevestiging), half-ingevuld scaffold (hervat intake) of bestaand project (git-checks + aanbod om uncommitted werk eerst te pushen).
---

# /start-sessie

## Wanneer dit skill gebruiken

Aan het begin van elke werksessie op een project onder `C:\Claudebase\`. De gebruiker typt `/start-sessie` of zegt "laten we beginnen", "start sessie", "wat is de staat?".

## Harde vereisten

1. De huidige werkmap moet onder `C:\Claudebase\<project>\` liggen (niet `C:\Claudebase\` zelf, niet `_template\` of `_archive\`).
2. Bij een bestaand project: `git remote -v` moet een GitHub-URL opleveren.
3. Nooit bestaande files in bestaande projecten overschrijven zonder vraag.

## Mode-detectie (allereerste stap)

Bepaal de mode voor je iets anders doet:

```
A. Empty-folder mode:   folder bevat geen CLAUDE.md én geen .git (of .git bestaat maar 0 commits)
B. Scaffolded-unfilled: CLAUDE.md bestaat maar bevat nog 'PROJECT_NAME' of '<...>'-placeholders
C. Existing-project:    CLAUDE.md is ingevuld EN git heeft ≥1 commit
```

Snelle check:
```bash
pwd
ls -la                     # CLAUDE.md aanwezig?
test -d .git && git rev-list --count HEAD 2>/dev/null || echo 0
grep -c 'PROJECT_NAME\|<Projectnaam>' CLAUDE.md 2>/dev/null || echo 0
```

## Mode A, empty-folder

### A1. Locatie-check + Pulse-regel

- Verifieer dat pwd `C:/Claudebase/<iets>` is. Anders stop en vraag de gebruiker eerst `cd` te doen.
- **Pulse-check** (memory-regel `feedback_pulse_integration_default.md`): vraag via AskUserQuestion: "Nieuwe tool — kan dit als Pulse-integratie (web-UI + REST), of moet dit écht standalone draaien?" Opties: `Pulse-integratie (Recommended)` / `Standalone Claudebase-project (met reden)`.
- Als Pulse: stop hier en wijs naar Pulse; maak geen scaffold. Als standalone: ga verder.

### A2. Input verzamelen

Vraag (in 1 bericht):
1. Projectnaam (`[A-Za-z0-9-_]+`, PascalCase aanbevolen)
2. GitHub-repo URL (`https://github.com/<user>/<repo>.git`). Geen URL → stop, vraag de gebruiker eerst `gh repo create` te draaien.

### A3. Scaffold + remote

```bash
cp -r "C:/Claudebase/_template/." .
git init -b main
git remote add origin <url>
```

Vervang `PROJECT_NAME` door de echte naam in: `package.json` (root + backend + frontend), `CLAUDE.md`, `index.html`, `HomeView.vue`, `ARCHITECTURE.md`, `MVP.md`.

### A4. MVP-intake

Gebruik AskUserQuestion of plain prompts (één per keer is ok):
- "MVP in één zin: wat doet het minimaal voor wie?"
- "Must-have features (3–7 bullets)?"
- "Succescriterium (meetbaar)?"
- "Dingen die bewust NIET in de MVP zitten?"
- "MVP-deadline (yyyy-mm-dd of 'geen')?"

Schrijf antwoorden in `docs/MVP.md` en vul ook de secties `Probleem`, `Doelgroep`, `Succescriteria` in `docs/PROJECT-BRIEF.md`.

### A5. Stack-bevestiging

- Lees en toon de tabel uit `docs/STACK-STANDARD.md`.
- Vraag: "Volg je de standaard, of wijkt een laag af?" Opties: `Ja, volledig standaard (Recommended)` / `Afwijking per laag toelichten`.
- Bij afwijking: vraag welke laag + reden. Toon de 1-zin-waarschuwing uit STACK-STANDARD.md sectie 4. Log elke afwijking in `docs/ARCHITECTURE.md#Stack-afwijkingen voor dit project` met reden.

### A6. Docs vullen + install + commit

- Vul `CLAUDE.md` (Project Overview sectie), `docs/ARCHITECTURE.md` (projectnaam + eventuele afwijkingen), `docs/UX-DESIGN.md` (alleen als de gebruiker er iets over zegt, anders placeholder laten).
- Vraag: "Nu `npm run install:all` draaien? Duurt ~2-5 minuten." Bij ja: run het. Bij nee: zeg dat de gebruiker dit later zelf moet doen.
- Initial commit + push:
  ```bash
  git add -A
  git commit -m "chore: initial scaffold (stack-standaard)"
  git push -u origin main
  ```
- Bij push-fout (remote bestaat maar is niet leeg): vraag of `git pull --rebase origin main --allow-unrelated-histories` toegestaan is.

### A7. Afronding

Toon:
- Pad naar project + GitHub-URL
- Volgende stap: `npm run dev` (root) om backend+frontend tegelijk op te starten
- Welke docs ingevuld zijn / nog te doen

## Mode B, scaffolded-unfilled

Detecteer welke docs nog placeholders bevatten (`grep -l '<.*>\|PROJECT_NAME' docs/*.md CLAUDE.md`). Voor elk placeholder-document: vraag de ontbrekende info. Hergebruik precies stappen A4 (MVP) en A5 (stack) voor de relevante files. Commit het ingevulde werk met `docs: fill project brief / mvp / stack`.

## Mode C, existing-project

### C1. Verplichte files

Controleer aanwezigheid:
- `CLAUDE.md` (root) — verplicht
- `docs/ARCHITECTURE.md` — verplicht
- `docs/UX-DESIGN.md` — verplicht
- `docs/STACK-STANDARD.md` — zacht verplicht. Ontbreekt: bied aan uit `_template/` te kopiëren.

Toon tabel `✓ / ✗`.

### C2. Git-state

```bash
git status
git status -sb
git log --oneline -5
git remote -v
```

Als `git remote` geen GitHub-URL heeft: stop en vraag de gebruiker een remote te koppelen.

### C3. Push-first-prompt (nieuw)

Als er **uncommitted** changes staan (`git status -sb` toont gewijzigde files):

Vraag via AskUserQuestion:
```
Je hebt ongecommitteerd werk van vorige sessie. Eerst pushen voor we starten?
- Ja, commit + push nu (Recommended)   → delegeer naar /einde-sessie flow: tests → commit → push
- Toon diff eerst                       → run `git diff --stat`, toon, vraag opnieuw
- Nee, laat staan en begin              → ga verder, waarschuw dat `/einde-sessie` straks deze + nieuwe changes samen committeert
```

### C4. Sync met remote

```bash
git fetch origin
git status -sb
```

Als `behind`: vraag of `git pull --ff-only` mag. Als `ahead`: herinneren dat `/einde-sessie` zal pushen.

### C5. Context samenvatten

Lees:
- `CLAUDE.md` Project Overview sectie
- `docs/MVP.md` (als aanwezig) om openstaande must-haves te zien
- `TODO.md` (als aanwezig)
- Laatste 3 commit-messages

Presenteer:
- 1 zin wat het project doet
- Openstaande MVP-checkboxes of TODOs
- Suggestie voor wat te doen deze sessie

### C6. Memory laden

Check `~/.claude/projects/<url-encoded-pad>/memory/MEMORY.md` voor user/feedback/project-memories. Pas gedrag aan.

## Stack-deviation-bewaking (alle modes)

Wanneer de gebruiker tijdens het gesprek vraagt om iets niet-standaard te installeren of te gebruiken (`npm install fastify`, `prisma init`, `bun run`, andere UI-framework, andere auth-systeem, andere database), reageer **eerst** met:

```
⚠ Dit wijkt af van docs/STACK-STANDARD.md (<laag>).
Voordeel standaard: <1 zin — bv. "één codebase-patroon in het hele bedrijf, minder onboarding-tijd".>
Bevestig dat je wil afwijken, anders gebruik ik de standaard (<aanbeveling>).
```

Voer pas na expliciete bevestiging de afwijkende actie uit. Log de afwijking in `docs/ARCHITECTURE.md#Stack-afwijkingen voor dit project`.

## Wat NIET te doen

- Geen wijzigingen maken zonder toestemming.
- Geen `git pull` draaien zonder te vragen.
- Bij mode A/B: niet zelf verzinnen wat de MVP is — alles komt van de gebruiker.
- De gebruiker niet vermoeien met alle details, alleen wat relevant is.
- Bij een bestaand project dat al afwijkt van de standaard: niet ongevraagd terug-migreren — alleen documenteren in ARCHITECTURE.md als nog niet gelogd.

## Foutafhandeling

| Probleem | Oplossing |
|---|---|
| Folder niet onder Claudebase | Stop, vraag `cd` of `/nieuw-project` |
| Geen GitHub-URL bij mode A | Stop, vraag gebruiker `gh repo create` te draaien |
| Mode-detectie ambigu | Vraag de gebruiker: "Leeg nieuw project, half-ingevuld, of bestaand?" |
| CLAUDE.md ontbreekt maar er is wel git-history | Behandel als mode C + bied aan CLAUDE.md aan te vullen uit `_template/` |
