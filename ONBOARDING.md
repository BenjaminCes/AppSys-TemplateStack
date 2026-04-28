# Onboarding-checklist (~45 min, vers Windows)

Loop van boven naar onder. Vink af. Vraag op Slack/Teams als iets niet
klopt.

> Wil je een **nieuw project** starten in plaats van de template
> verkennen? Lees [`NIEUW-PROJECT.md`](./NIEUW-PROJECT.md) na de
> installs.
>
> Werk je aan een **bestaand** project (fork) dat je wil upgraden? Lees
> [`MIGRATIE-bestaand-project.md`](./MIGRATIE-bestaand-project.md).

## Installs (15 min)

- [ ] **Node.js 20 LTS**: https://nodejs.org (kies LTS-installer,
      next-next-finish)
- [ ] **Git**: https://git-scm.com (default options)
- [ ] **Claude Code CLI** (aanbevolen): https://docs.claude.com/claude-code
- [ ] **VS Code**: https://code.visualstudio.com + extensions: Vue
      (Volar), Tailwind CSS IntelliSense, ESLint

Verificatie in een terminal:
```
node --version    # v20.x
git --version
claude --version  # alleen als je Claude Code installeerde
```

## Repo (5 min)

- [ ] Maak de Claudebase-folder: `mkdir C:\Claudebase && cd C:\Claudebase`
- [ ] `git clone https://github.com/BenjaminCes/AppSys-TemplateStack`
- [ ] `cd AppSys-TemplateStack`

## Dependencies (5 min)

- [ ] `npm run install:all` (duurt ~2-3 min)
- [ ] Verifieer dat de pre-commit hook actief is:
      `git config core.hooksPath` retourneert `scripts/git-hooks`. Niet?
      Draai `git config core.hooksPath scripts/git-hooks`.
- [ ] `cp .env.example .env` (Windows: `copy .env.example .env`)
- [ ] Genereer een `JWT_SECRET` en zet in `.env`:
  - PowerShell:
    `[Convert]::ToBase64String((1..32 | % {[byte](Get-Random -Max 256)}))`
  - macOS/Linux: `openssl rand -hex 32`

## Smoke-test (10 min)

- [ ] `npm run dev` (beide servers, backend op 3001, frontend op 5173)
- [ ] Open http://localhost:5173
- [ ] Login met seed-admin:
      email `admin@appsys.local`, wachtwoord `appsys00`
- [ ] Je ziet de Welkom-pagina + sidebar-link `Beheerspanel` (admin
      heeft die zichtbaar)
- [ ] Klik `Beheerspanel`: items + gebruikers-tabellen
- [ ] Test Ctrl+K: zoekbalk focust, typ `stack` of `auth`, klik op
      een treffer, je scrollt naar het juiste paneel
- [ ] Open http://localhost:3001/api/health, verwacht
      `{"status":"ok","timestamp":"..."}`
- [ ] `Ctrl+C` om servers te stoppen
- [ ] `npm test`: 11 backend-tests + 1 frontend-test, alles groen
- [ ] `npm run lint`: 0 errors

## Standalone preview verkennen (2 min)

- [ ] Open `_template/index.html` direct in je browser (dubbelklik of
      `file:///C:/Claudebase/AppSys-TemplateStack/index.html`)
- [ ] Klik `Beheerspanel` in de sidebar, klik terug op `Home`
- [ ] Test Ctrl+K met `gebruikers` of `huisstijl` als zoekterm

## Claude Code skills (5 min, optioneel maar aanbevolen)

- [ ] Windows: `./onboarding/install-skills.ps1`
- [ ] macOS/Linux/Git-Bash: `bash onboarding/install-skills.sh`
- [ ] Open Claude Code in deze folder, typ `/`, je ziet `/start-sessie`,
      `/nieuw-project`, `/einde-sessie`
- [ ] Typ `/start-sessie`, de skill detecteert dat dit een bestaand
      project is

## Lees (5 min)

- [ ] [`README.md`](./README.md) volledig
- [ ] [`docs/STACK-STANDARD.md`](./docs/STACK-STANDARD.md) secties 1 + 2
- [ ] [`docs/UX-DESIGN.md`](./docs/UX-DESIGN.md) secties Design-principes
      + Visual language

## Klaar?

- [ ] Scaffold een test-project: `/nieuw-project HelloWorld` (vereist
      een lege GitHub-repo). Doorloop de flow, verifieer de repo, ruim
      daarna op.
- [ ] Plan een 30-min intake met team-lead voor je eerste echte task.

Welkom bij het team.
