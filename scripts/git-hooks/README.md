# Git hooks

Versionned pre-commit hook voor dit project. Wordt automatisch geactiveerd
via `npm install` (de `postinstall`-script in root `package.json` zet
`git config core.hooksPath scripts/git-hooks`).

## Handmatig activeren

Als de hook niet actief is (bv. na een fresh clone zonder install of als
de config is gereset):

```bash
git config core.hooksPath scripts/git-hooks
```

Verifieer met:

```bash
git config core.hooksPath
# verwacht: scripts/git-hooks
```

## Wat de pre-commit hook checkt

Op staged `.vue/.ts/.tsx`-bestanden onder `frontend/src/` of `backend/src/`
(test-bestanden uitgesloten):

1. **Em-dashes** (U+2014) - verboden door `docs/style-guide.md`. Gebruik
   komma, dubbele punt of en-dash.
2. **Curly quotes** (U+201C/D, U+2018/9) - LLM-tell. Gebruik rechte
   quotes.
3. **AI-tell-emoji's en bliksem-iconen** - bolt, lightbulb, sparkles,
   rocket, fire, star, check-box, cross-box, heavy-check, warn. Plus
   imports van `BoltIcon`, `LightningBoltIcon`, `ZapIcon`.
4. **Hardcoded hex-kleuren** in `.vue/.ts`. Hex is alleen toegestaan in
   `tailwind.config.js`, `style.css`, `tokens.css`, `public/brand/*` en
   binnen `<style>...</style>`-blokken van `.vue`-files (dat is CSS).
   In `<template>` en `<script>` van .vue, en in elke `.ts/.tsx`, blijft
   hex verboden. Gebruik `brand.*` of `gray-*` Tailwind-tokens.
5. **Geblokkeerde Tailwind-kleur-classes** - `orange/amber/yellow/lime/green/
   emerald/teal/cyan/sky/blue/indigo/violet/purple/fuchsia/pink/rose`.
   Whitelist: `brand-*`, `gray-*`, `slate-*`, `red-*` (alleen voor
   error-states), `white`, `black`, `transparent`, `current`.
6. **ESLint** over de staged files. Errors blokkeren commit.

## Bypass

Alleen bij absolute noodzaak (bv. emergency-fix met bekend issue):

```bash
git commit --no-verify -m "..."
```

Documenteer in de commit-body waarom je hebt gebypassed.

## Hook uitzetten lokaal (alleen tijdens debug)

```bash
git config --unset core.hooksPath
```

Zet hem direct daarna weer aan voor je commit.
