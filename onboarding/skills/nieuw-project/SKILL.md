---
name: nieuw-project
description: Scaffold een nieuw project onder C:\Claudebase\. Verplicht: GitHub-repo URL. Pulse-first-check, kopieert _template\, initialiseert git, loopt door MVP-intake + stack-bevestiging, pusht initial commit. Gedraagt zich als shortcut naar /start-sessie mode A.
---

# /nieuw-project

## Wanneer dit skill gebruiken

De gebruiker wil een nieuw project starten onder `C:\Claudebase\`. Herkenbaar aan: "nieuw project", "maak project <naam>", "start project X".

Functioneel identiek aan `/start-sessie` mode A (empty-folder), maar expliciet opgeroepen met een projectnaam als argument.

## Harde vereisten (niet overslaan)

1. **Pulse-first-check**: memory zegt dat nieuwe tools default in Pulse horen. Alleen bij expliciete standalone-reden scaffolden.
2. **GitHub-repo URL is verplicht**. Zonder URL: stop en vraag erom. Geen scaffold zonder URL.
3. Project-naam is verplicht en mag geen spaties of speciale tekens bevatten (alleen `[A-Za-z0-9-_]`).
4. De doelmap `C:\Claudebase\<naam>\` mag nog niet bestaan.

## Procedure

### Stap 1: Pulse-first-check

Vraag via AskUserQuestion: "Nieuwe tool — kan dit als Pulse-integratie (web-UI + REST), of moet dit écht standalone draaien?"
- `Pulse-integratie (Recommended)` → stop hier, wijs naar Pulse
- `Standalone Claudebase-project (geef reden)` → ga verder, log de reden kort in `docs/ARCHITECTURE.md#Overzicht`

### Stap 2: Input verzamelen

Vraag:
- **Projectnaam** (PascalCase aanbevolen, bv. `MyApp`)
- **GitHub-repo URL** (`https://github.com/<user>/<repo>.git`). Als er nog geen repo bestaat: laat de gebruiker eerst `gh repo create <user>/<repo> --private --confirm` draaien of handmatig een leeg repo maken.

Controleer dat de URL naar GitHub wijst (`github.com`). Andere remotes: vraag expliciete bevestiging.

### Stap 3: Scaffold aanmaken

```bash
cp -r "C:/Claudebase/_template/." "C:/Claudebase/<naam>/"
cd "C:/Claudebase/<naam>/"
git init -b main
git remote add origin <url>
```

Vervang `PROJECT_NAME` door de echte projectnaam in: `package.json` (root + backend + frontend), `CLAUDE.md`, `index.html`, `HomeView.vue`, `ARCHITECTURE.md`, `MVP.md`.

### Stap 4: MVP-intake

Vraag sequentieel:
1. MVP in één zin — wat doet het minimaal voor wie?
2. Must-have features (3–7 bullets)
3. Succescriterium (meetbaar)
4. Bewust uitgesloten uit MVP
5. MVP-deadline (yyyy-mm-dd of 'geen')

Vul `docs/MVP.md` en de relevante secties van `docs/PROJECT-BRIEF.md`.

### Stap 5: Stack-bevestiging

- Lees `docs/STACK-STANDARD.md` sectie 1 (de tabel), toon die aan de gebruiker.
- Vraag: "Volg je de standaard, of wijkt een laag af?" Opties: `Ja, volledig standaard (Recommended)` / `Afwijking per laag toelichten`.
- Bij afwijking: vraag welke laag + reden. Toon de 1-zin-waarschuwing uit STACK-STANDARD.md sectie 4. Log in `docs/ARCHITECTURE.md#Stack-afwijkingen voor dit project`.
- Bij volledig standaard: doe niks extra — de pre-filled tabel in ARCHITECTURE.md klopt al.

### Stap 6: Docs invullen

Werk met de gebruiker per bestand (elke mag "skip" zeggen, maar CLAUDE.md#Project-Overview is verplicht):
1. `CLAUDE.md` Project Overview — 1-2 zinnen
2. `docs/PROJECT-BRIEF.md` — Stakeholders + Tijdlijn + Risico's
3. `docs/UX-DESIGN.md` — Design-principes + Visual language (kleur, font)

### Stap 7: Install (optioneel) + initial commit + push

- Vraag: "Nu `npm run install:all` draaien?" (duurt 2-5 min). Bij ja: run het. Bij nee: zeg dat de gebruiker dit later zelf moet doen.
- Commit + push:
  ```bash
  git add -A
  git commit -m "chore: initial scaffold (stack-standaard)"
  git push -u origin main
  ```
- Bij push-fout (remote bestaat maar niet leeg): vraag of `git pull origin main --allow-unrelated-histories` mag, dan opnieuw pushen.

### Stap 8: README bijwerken

Voeg het project toe aan de tabel in `C:\Claudebase\README.md` onder "Actieve projecten" als die sectie bestaat.

### Stap 9: Bevestiging

Geef de gebruiker:
- Pad naar project + GitHub-URL
- Volgende stap: `cd C:\Claudebase\<naam> && npm run dev`
- Welke docs nog ingevuld moeten worden

## Wat NIET te doen

- Nooit scaffolden zonder GitHub-URL.
- Nooit een bestaande map overschrijven.
- Nooit `.env` of secrets in de initial commit (gitignore dekt dit, maar dubbelcheck).
- Niet de `_template\` folder zelf wijzigen tijdens scaffolden.
- Niet zelf de MVP invullen — altijd van de gebruiker.

## Foutafhandeling

| Probleem | Oplossing |
|---|---|
| `git push` vraagt credentials | Laat gebruiker `gh auth login` draaien |
| Remote-repo bestaat niet | Suggereer `gh repo create` |
| Doelmap bestaat al | Stop, vraag of gebruiker hernoemen wil |
| Template niet gevonden | Controleer `C:\Claudebase\_template\` bestaat |
| Gebruiker wil stack-afwijking | Toon STACK-STANDARD.md sectie 4 waarschuwing, bevestig, log in ARCHITECTURE.md |
