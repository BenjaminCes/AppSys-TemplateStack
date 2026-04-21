# onboarding/

Snapshot van de AppSys Claude Code skills + agents voor distributie.

**Niet bewerken in deze folder.** De canonical bron is `~/.claude/skills/` + `~/.claude/agents/` bij de onderhouder. Deze folder wordt handmatig gesynct bij elke stack-update.

## Inhoud

- `skills/start-sessie/SKILL.md`
- `skills/einde-sessie/SKILL.md`
- `skills/nieuw-project/SKILL.md`
- `agents/security-scan.md`
- `install-skills.ps1` \u2014 Windows PowerShell
- `install-skills.sh` \u2014 macOS / Linux / Git-Bash

## Installeren

Zie de root-`README.md` sectie "Claude Code workflow" of draai direct:

```powershell
./onboarding/install-skills.ps1
```

of

```bash
bash onboarding/install-skills.sh
```

Scripts overschrijven bestaande files met dezelfde naam. Als je lokale wijzigingen hebt in `~/.claude/skills/<naam>/`, back-up die eerst.

## Bij scaffold

Wanneer je via `cp -r _template/. <nieuw-project>/` een nieuw project maakt, **verwijder deze `onboarding/` folder + de root-`README.md` + `ONBOARDING.md`** in het nieuwe project. Die horen alleen bij de template zelf, niet bij scaffolded projecten.
