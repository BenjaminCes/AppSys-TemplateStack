---
name: einde-sessie
description: Sluit een werksessie af op een Claudebase-project. Draait lint/tests, biedt optionele security-scan aan (agent + npm audit + secrets-grep), stageert changes, vraagt commit-message, committeert en pusht naar GitHub. Stelt memory-updates voor als er nieuwe guidelines geleerd zijn.
---

# /einde-sessie

## Wanneer dit skill gebruiken

Aan het einde van een werksessie op een project onder `C:\Claudebase\`. De gebruiker typt `/einde-sessie` of zegt "sluit sessie", "push dit", "we zijn klaar".

## Harde vereisten

1. Huidige werkmap moet onder `C:\Claudebase\<project>\` liggen.
2. Er moet een `origin` remote naar GitHub geconfigureerd zijn.
3. Nooit force-pushen. Nooit skippen van hooks tenzij expliciet door gebruiker gevraagd.

## Procedure

### Stap 1: Lint & tests

Detecteer beschikbare scripts in `package.json` (root + backend + frontend):
- Als `scripts.lint` bestaat: draai `npm run lint`
- Als `scripts.test` bestaat: draai `npm test` (of `npm run test`)
- Als `scripts.typecheck` bestaat: draai `npm run typecheck`

Draai backend + frontend parallel waar mogelijk. Bij falende lint/tests: toon output, vraag gebruiker of toch committeren (hard waarschuwen tegen committen van rode tests).

### Stap 1.5: Security-scan (optioneel)

Vraag via AskUserQuestion:
```
Security-scan uitvoeren voor we committen?
(Claude-agent + npm audit + secrets-grep, ~10-20s, gebruikt tokens)

- Ja, scan nu (Recommended voor prod-projecten of nieuwe deps)
- Nee, sla over
```

**Bij "Nee"**: ga direct door naar Stap 2.

**Bij "Ja"**:
1. Roep `Agent` aan met:
   - `subagent_type`: `security-scan`
   - `description`: "Security-scan pre-commit"
   - `prompt`: "Scan de huidige working tree (staged + unstaged + untracked) in `<current working dir>`. Volg de 4-fase procedure in `~/.claude/agents/security-scan.md`. Lever het eindrapport in het voorgeschreven format (CRITICAL/HIGH/MEDIUM/INFO + verdict)."
2. Toon het rapport integraal aan de gebruiker.
3. Evalueer het verdict:
   - **Geen findings (`✓`)**: ga door naar Stap 2.
   - **MEDIUM / INFO only**: toon, ga door naar Stap 2 (gebruiker mag in commit-body opmerken).
   - **HIGH of CRITICAL**: vraag via AskUserQuestion:
     ```
     [Commit toch (geef reden)]  → vraag reden, log als commit-body-regel `Security-scan: <aantal> findings. Accepted: <reden>.`
     [Fix eerst]                 → stop hier, laat gebruiker fixen, gebruiker hertart /einde-sessie
     [Cancel session-end]        → stop zonder te committen
     ```

Nooit automatisch committen bij CRITICAL findings zonder expliciete user-keuze.

### Stap 2: Git-status

```bash
git status
git diff --stat
```

Toon:
- Welke files gewijzigd/nieuw/verwijderd
- Omvang van diff

Als niets te committen: vraag "geen changes. Toch pushen (bv. lokale commits)?" of "sessie afsluiten zonder commit?".

### Stap 3: Commit-message voorstellen

Op basis van de diff + laatste 3 commits (voor stijl-consistentie), stel een message voor:
- **Stijl**: Engels, imperatief, 50 char subject, geen em-dashes
- **Conventional commits** (feat/fix/chore/docs/refactor) waar passend
- Body met bullets als er meerdere logische changes zijn
- Als security-scan findings gemerkt zijn voor "commit toch": voeg `Security-scan: ...` regel toe aan de body

Vraag de gebruiker: "Voorstel: `<message>`. Aanpassen of ok?" (AskUserQuestion).

### Stap 4: Stage & commit

```bash
git add -A
git commit -m "<goedgekeurde message>"
```

Nooit `git add <specifieke-file>` gebruiken zonder reden: de gebruiker verwacht alle changes te committen na het review-moment. Wel checken dat `.env`, `*.db`, `node_modules` geen onverwachts gecommit worden (gitignore zou dit moeten afvangen).

### Stap 5: Push

```bash
git push origin <current-branch>
```

Als de branch nog geen upstream heeft: `git push -u origin <branch>`.

Als push faalt door divergence: **niet** automatisch `--force`. Toon de fout, suggereer `git pull --rebase` met bevestiging van de gebruiker.

### Stap 6: Memory-update (optioneel)

Als tijdens de sessie iets opviel dat in memory hoort (user-preferentie, nieuwe feedback, project-beslissing): stel een MEMORY-update voor. Laat gebruiker bevestigen voor het weggeschreven wordt.

### Stap 7: Afsluiting

Geef een korte samenvatting:
- Commit-hash + message
- Remote-URL waar het naartoe ging
- Staat van het project (tests groen/rood, security-scan verdict indien uitgevoerd, TODOs open)
- "Tot de volgende sessie."

## Wat NIET te doen

- **Nooit** `git push --force` of `git push -f` zonder expliciete toestemming.
- **Nooit** `git reset --hard` om conflicts op te lossen.
- **Nooit** `--no-verify` om hooks te skippen.
- **Nooit** `.env`, secrets, of grote binary files committen.
- **Nooit** amend een al gepushte commit.
- **Nooit** automatisch committen bij CRITICAL findings uit de security-scan.

## Foutafhandeling

| Probleem | Oplossing |
|---|---|
| Lint/tests falen | Toon output, vraag of toch committen |
| Security-scan vindt CRITICAL | Stop, vraag [Commit toch met reden / Fix eerst / Cancel] |
| Security-agent faalt te starten | Meld de fout, bied aan scan over te slaan, ga door |
| Pre-commit hook faalt | Fix issue, re-stage, nieuwe commit (niet amend) |
| Push wordt rejected (non-fast-forward) | `git pull --rebase origin <branch>`, los conflicts op, push opnieuw |
| Geen `origin` remote | Stop, vraag gebruiker GitHub-repo te koppelen |
| Werk op `main` met protected branch | Suggereer feature-branch + PR via `gh pr create` |
