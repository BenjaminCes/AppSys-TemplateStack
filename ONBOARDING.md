# Onboarding-checklist (~45 min, vers Windows)

Loop van boven naar onder. Vink af. Vraag op Slack/Teams als iets niet klopt.

## Installs (15 min)

- [ ] **Node.js 20 LTS** \u2014 https://nodejs.org (kies LTS-installer, next-next-finish)
- [ ] **Git** \u2014 https://git-scm.com (default options)
- [ ] **Claude Code CLI** \u2014 https://docs.claude.com/claude-code (volg install-instructies voor jouw OS)
- [ ] **VS Code** \u2014 https://code.visualstudio.com + extensions: Vue (Volar), Tailwind CSS IntelliSense, ESLint

Verificatie in een terminal:
```
node --version    # v20.x
git --version
claude --version
```

## Repo (5 min)

- [ ] Maak de Claudebase-folder: `mkdir C:\Claudebase && cd C:\Claudebase`
- [ ] `git clone https://github.com/BenjaminCes/AppSys-TemplateStack`
- [ ] `cd AppSys-TemplateStack`

## Dependencies (5 min)

- [ ] `npm run install:all` (duurt ~2-3 min)
- [ ] `cp .env.example .env` (Windows: `copy .env.example .env`)
- [ ] Genereer een `JWT_SECRET` en zet in `.env`:
  - PowerShell: `[Convert]::ToBase64String((1..32 | % {[byte](Get-Random -Max 256)}))`
  - macOS/Linux: `openssl rand -hex 32`

## Smoke-test (10 min)

- [ ] `npm run dev` \u2014 beide servers moeten opstarten (backend op 3001, frontend op 5173)
- [ ] Open http://localhost:5173
- [ ] Klik **Registreren**, maak een test-account (bv. `test@appsys.be` + 8-char wachtwoord)
- [ ] Je wordt ingelogd, HomeView toont je email
- [ ] Open http://localhost:3001/api/health \u2014 verwacht: `{"status":"ok","timestamp":"..."}`
- [ ] `Ctrl+C` om servers te stoppen
- [ ] `npm test` \u2014 verwacht: backend (auth + me + health) + frontend (smoke) allemaal groen

## Claude Code skills (5 min)

- [ ] Windows: `./onboarding/install-skills.ps1`
- [ ] macOS/Linux/Git-Bash: `bash onboarding/install-skills.sh`
- [ ] Open Claude Code in deze folder, typ `/` \u2014 je ziet `/start-sessie`, `/einde-sessie`, `/nieuw-project`
- [ ] Typ `/start-sessie` \u2014 de skill moet detecteren dat dit een bestaand project is

## Lees (5 min)

- [ ] [`README.md`](./README.md) volledig
- [ ] [`docs/STACK-STANDARD.md`](./docs/STACK-STANDARD.md) secties 1 + 2 (stack + wanneer afwijken)

## Klaar?

- [ ] Scaffold een test-project: `/nieuw-project HelloWorld` \u2014 doorloop de flow, verifieer dat er een repo op GitHub staat, verwijder het daarna
- [ ] Plan 30-min intake met team-lead voor eerste echte task

Welkom bij het team.
