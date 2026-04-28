# Migratie: bestaand project naar de huidige AppSys-stack

> Voor engineers die de oude versie van `AppSys-TemplateStack` hebben
> gekloond en al eigen content (views, routes, migrations) gebouwd
> hebben, en nu willen upgraden zonder hun werk te verliezen.

---

## TL;DR

```bash
cd C:/Claudebase/<jouw-fork>          # in de root van je fork
git status                            # working tree moet clean zijn

# Haal het script binnen (eenmalig, vanaf de huidige template):
curl -fsSL https://raw.githubusercontent.com/BenjaminCes/AppSys-TemplateStack/main/scripts/upgrade-from-template.mjs -o scripts/upgrade-from-template.mjs

# Draai het script:
node scripts/upgrade-from-template.mjs
```

Het script:
1. Voegt `upstream` als remote toe en fetcht.
2. Maakt een nieuwe branch `chore/appsys-stack-upgrade` (jouw `main`
   blijft onaangeroerd).
3. Vraagt drie ja/nee-vragen (Laag 1, Laag 2, Laag 3) en haalt alleen de
   gevraagde files binnen.
4. Print de exacte vervolgstappen.

Daarna voer je drie commando's uit:

```bash
npm run install:all       # nieuwe dev-deps + pre-commit hook activeren
npm run lint:fix          # auto-fix wat fixable is
npm test                  # validate dat niks brak
```

En je commit + pusht zoals je gewend bent.

---

## Drie lagen (wat het script vraagt)

| Laag | Inhoud | Effort | Effect |
|---|---|---|---|
| **1. Huisstijl + guardrails** *(verplicht)* | Brand-tokens, AppShell-CSS, hartslag-logo, ESLint configs, pre-commit hook, skills, docs (style-guide, UX-DESIGN, STACK-STANDARD) | ~30 min waarvan 25 voor lint-fixes | Je krijgt navy/oranje uit de doos en kan niet meer wegdrijven naar generic-Tailwind-blue. ESLint blokkeert externe UI-libs. |
| **2. AppShell layout** *(aanbevolen)* | `frontend/src/components/layout/`, items-store, types | ~1 uur (handwerk in views) | Sidebar + topbar + Ctrl+K-search overal. Je wrapt je bestaande views in `<AppShell>`. |
| **3. RBAC** *(optioneel)* | role-migrations + `requireRole`-middleware + `/api/admin/users` | ~30 min | admin/user-onderscheid + seed-admin (`admin@appsys.local` / `appsys00`). Je integreert role in je eigen authService.ts handmatig. |

**Het script raakt niet aan**: jouw eigen `routes/`, `services/`,
`migrations/` (alleen 003 + 004 worden toegevoegd, niet je bestaande),
`views/`, `stores/`, je eigen entries in `router/index.ts`. Wat het wel
overschrijft staat in de drie lijsten in `scripts/upgrade-from-template.mjs`.

---

## Na laag 1: lint-fixes

`npm run lint` zal errors geven op alle plekken waar je generieke
Tailwind kleur-classes gebruikt. Vervang per dit patroon:

| Was                          | Wordt                                     |
|------------------------------|-------------------------------------------|
| `bg-blue-600`                | `bg-brand-orange`                         |
| `bg-blue-700` (hover)        | `bg-brand-orange-hover`                   |
| `text-blue-600` (link)       | `text-brand-orange hover:text-brand-orange-hover` |
| `bg-green-500` (success-pill)| `bg-brand-green/15 text-brand-green-deep` |
| `bg-red-600` (error)         | blijft `bg-red-600` (rood is gewhitelist voor errors) |
| `bg-slate-900` / `bg-zinc-*` | `bg-gray-900` / `bg-gray-*`               |

Externe UI-libs (vuetify, bootstrap, primevue, quasar, `@mui/*`,
`@chakra-ui/*`, element-plus, naive-ui, ant-design-vue) zijn geblokkeerd.
Verwijder met `npm uninstall <lib>` en bouw de component zelf met
Tailwind. Geen ADR? Dan is het verboden.

---

## Na laag 2: views in AppShell wrappen

Voor elke ingelogde view (login/register staan buiten):

```vue
<script setup lang="ts">
import AppShell from '@/components/layout/AppShell.vue'
</script>

<template>
  <AppShell page-title="Connectors" eyebrow="Beheer">
    <div class="px-6 py-8 max-w-6xl mx-auto">
      <!-- jouw bestaande content blijft hier -->
    </div>
  </AppShell>
</template>
```

Pas je sidebar-items aan in `frontend/src/components/layout/AppShell.vue`:
de defaults zijn generiek (Items, Rapporten); vervang door je echte
routes.

---

## Na laag 3: role-integratie

De script-files geven je het skelet. Twee handmatige aanpassingen:

1. `backend/src/services/authService.ts` (jouw versie): `User` interface
   krijgt `role: 'admin' | 'user'`, queries selecteren `role` mee.
2. `backend/src/routes/auth.ts`: bij register en login `role` mee
   returnen in `{ user, token }`.
3. `frontend/src/stores/auth.ts`: `User`-type uitbreiden + getter
   `isAdmin`. Routes met `meta: { requiresRole: 'admin' }` worden
   afgehandeld door de bestaande beforeEach-guard.

Vergelijking maken met de upstream-versie:
```bash
git diff upstream/main -- backend/src/services/authService.ts
git diff upstream/main -- frontend/src/stores/auth.ts
```

---

## PR openen

```bash
git push -u origin chore/appsys-stack-upgrade
gh pr create --title "Upgrade naar huidige AppSys-stack" \
             --body "Laag 1 + 2 + 3 gemigreerd via scripts/upgrade-from-template.mjs"
```

---

## Veelvoorkomende issues

| Symptoom | Fix |
|---|---|
| `npm run lint` faalt op `bg-blue-600` enz. | Vervang per de tabel hierboven, of `npm run lint:fix` |
| Pre-commit hook draait niet | `git config core.hooksPath scripts/git-hooks` |
| Hook zegt "hex gevonden" terwijl het in `<style>` van een Vue-file staat | Update naar laatste `scripts/git-hooks/pre-commit` (skip `<style>`-blokken sinds 2026-04-28) |
| AppShell rendert niet, sidebar leeg | Login eerst, of test met seed-admin |
| Externe UI-lib geinstalleerd | `npm uninstall <lib>`, bouw component zelf |

---

## Vragen of hulp

Open een issue op
https://github.com/BenjaminCes/AppSys-TemplateStack/issues.
