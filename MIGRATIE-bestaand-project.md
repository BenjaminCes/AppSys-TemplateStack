# Migratie: bestaand project naar de huidige AppSys-stack

> Dit document is voor engineers die de oude versie van `AppSys-TemplateStack`
> hebben gekloond en al eigen content (views, routes, migrations, business
> logic) gebouwd hebben, en nu willen upgraden naar de huidige huisstijl +
> guardrails **zonder hun werk te verliezen**.

De upgrade is opgesplitst in drie lagen. Loop van boven naar onder. Stop op
elke laag waar je geen behoefte aan hebt; elke laag is op zichzelf
functioneel.

---

## Voor je begint

```bash
# 1. Sta in de root van je fork (de map met je package.json)
cd C:/Claudebase/<jouw-fork>

# 2. Zorg dat je clean staat. Geen openstaande wijzigingen.
git status
# verwacht: "nothing to commit, working tree clean"

# 3. Voeg de upstream-template als remote toe (eenmalig)
git remote add upstream https://github.com/BenjaminCes/AppSys-TemplateStack.git
git fetch upstream

# 4. Maak een upgrade-branch
git checkout -b chore/appsys-stack-upgrade
```

Vanaf nu trek je per laag specifieke files binnen via `git checkout
upstream/main -- <file>`. Geen wholesale merge: dat zou je eigen views en
routes overschrijven.

---

## Laag 1 — Huisstijl + guardrails (verplicht, raakt geen content)

Doel: branding goedzetten en quality-gates activeren. Geen impact op je
eigen routes, views of migrations.

### Bestanden binnentrekken

```bash
# Branding (kleuren-tokens, fonts, hartslag-logo, favicon)
git checkout upstream/main -- frontend/tailwind.config.js
git checkout upstream/main -- frontend/src/style.css
git checkout upstream/main -- frontend/index.html
git checkout upstream/main -- frontend/public/brand/

# ESLint configs (blokkeert externe UI-libs en niet-brand kleur-classes)
git checkout upstream/main -- .eslintrc.cjs
git checkout upstream/main -- frontend/.eslintrc.cjs
git checkout upstream/main -- backend/.eslintrc.cjs

# Pre-commit hook (em-dashes, hex-codes, kleur-classes, ESLint)
git checkout upstream/main -- scripts/git-hooks/

# Documentatie (huisregels)
git checkout upstream/main -- docs/style-guide.md
git checkout upstream/main -- docs/UX-DESIGN.md
git checkout upstream/main -- docs/STACK-STANDARD.md

# Skills (Claude Code slash-commands)
git checkout upstream/main -- onboarding/skills/
git checkout upstream/main -- onboarding/install-skills.ps1
git checkout upstream/main -- onboarding/install-skills.sh
git checkout upstream/main -- onboarding/agents/
```

### Package.json updates (handmatig mergen)

De template-versie van `package.json` heeft nieuwe dev-deps en scripts. Je
eigen `package.json` heeft mogelijk eigen scripts die je wil houden. Open
beide naast elkaar:

```bash
git show upstream/main:package.json > /tmp/upstream-root.json
git show upstream/main:frontend/package.json > /tmp/upstream-fe.json
git show upstream/main:backend/package.json > /tmp/upstream-be.json
```

Voeg in je eigen `package.json` toe (of merge):
- **Root**: scripts `lint`, `lint:fix`, `postinstall` (de `postinstall`
  activeert de pre-commit hook).
- **Frontend**: dev-deps `eslint`, `@typescript-eslint/parser`,
  `@typescript-eslint/eslint-plugin`, `eslint-plugin-vue`,
  `@vue/eslint-config-typescript`. Scripts `lint`, `lint:fix`.
- **Backend**: dev-deps `eslint`, `@typescript-eslint/parser`,
  `@typescript-eslint/eslint-plugin`. Scripts `lint`, `lint:fix`.

### Installeren + activeren

```bash
npm run install:all
# postinstall doet automatisch: git config core.hooksPath scripts/git-hooks
git config core.hooksPath
# verwacht: scripts/git-hooks
```

### Eerste lint-run

```bash
npm run lint
```

Verwachte uitkomst: **errors** op alle plekken waar je generieke Tailwind
kleur-classes gebruikt (`bg-blue-600`, `text-red-700`, enz.) en op
externe UI-libs als je die geinstalleerd hebt.

Per error: vervang door brand-tokens of gray-tinten.

| Was                          | Wordt                                     |
|------------------------------|-------------------------------------------|
| `bg-blue-600`                | `bg-brand-orange`                         |
| `bg-blue-700` (hover)        | `bg-brand-orange-hover`                   |
| `text-blue-600` (link)       | `text-brand-orange hover:text-brand-orange-hover` |
| `bg-green-500` (success-pill)| `bg-brand-green/15 text-brand-green-deep` |
| `bg-red-600` (error)         | `bg-red-600` (rood is toegestaan voor errors) |
| `bg-slate-900` / `bg-zinc-*` | `bg-gray-900` / `bg-gray-*`               |

Auto-fix waar mogelijk:
```bash
npm run lint:fix
```

Bij externe UI-libs (`vuetify`, `bootstrap`, `primevue`, `quasar`,
`@mui/*`, `@chakra-ui/*`, `element-plus`, `naive-ui`, `ant-design-vue`):
verwijder via `npm uninstall <lib>` en bouw de equivalente component
zelf met Tailwind. Geen ADR? Dan is het verboden.

Commit:
```bash
git add -A
git commit -m "chore: upgrade huisstijl + ESLint + pre-commit hook"
```

---

## Laag 2 — AppShell layout (aanbevolen)

Doel: alle ingelogde views krijgen de officiële sidebar + topbar (navy
gradient + oranje accent + Ctrl+K-search-balk + hartslag-logo).

### AppShell binnenhalen

```bash
git checkout upstream/main -- frontend/src/components/layout/
```

Optioneel als je de werkende search wil: ook de items-store binnenhalen.
Dit raakt geen backend-code, alleen de frontend-store voor het zoeken.
Vereist **niet** de `items`-tabel uit de template.

```bash
# Alleen als je een /api/search endpoint hebt of zelf gaat schrijven
git checkout upstream/main -- frontend/src/stores/items.ts
git checkout upstream/main -- frontend/src/types/domain.ts
```

> Als je de search niet meteen wil: open `AppShell.vue` en verwijder het
> `<div ref="searchWrapperRef">`-blok plus de search-imports. De rest van
> AppShell (sidebar + topbar) blijft werken.

### Eigen views in AppShell wrappen

Open elke ingelogde view (bv. `views/ConnectorsView.vue`) en wrap de
content. Was:

```vue
<template>
  <div class="...jouw-eigen-layout...">
    <h1>Connectors</h1>
    <!-- jouw content -->
  </div>
</template>
```

Wordt:

```vue
<script setup lang="ts">
import AppShell from '@/components/layout/AppShell.vue'
</script>

<template>
  <AppShell page-title="Connectors" eyebrow="Beheer">
    <div class="px-6 py-8 max-w-6xl mx-auto">
      <!-- jouw bestaande content blijft hier exact zoals ze was -->
    </div>
  </AppShell>
</template>
```

Auth-views (`LoginView.vue`, `RegisterView.vue`) staan **buiten**
AppShell. Niet wrappen.

### Sidebar-items aanpassen

Open `frontend/src/components/layout/AppShell.vue`. De default-template
heeft generieke items (`Items`, `Rapporten`). Vervang door je eigen
routes:

```vue
<RouterLink
  to="/connectors"
  class="app-sidebar__link"
  active-class="app-sidebar__link--active"
>
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
  </svg>
  Connectors
</RouterLink>
```

### App.vue cleanup

Als je oude `App.vue` een eigen layout had (sidebar / topbar / wrapper),
vervang door:

```vue
<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <RouterView />
  </div>
</template>
```

AppShell wordt nu per view gewrapt, niet globaal.

### Test

```bash
npm run dev
# open http://localhost:5173, login
# alle views moeten de sidebar + topbar tonen
# Ctrl+K opent de zoekbalk
```

Commit:
```bash
git add -A
git commit -m "feat: wrap views in AppShell, adopt huisstijl-layout"
```

---

## Laag 3 — RBAC (optioneel)

Doel: standaard admin/user-onderscheid, met een seed-admin
(`admin@appsys.local` / `appsys00`) en een `/admin`-route alleen voor
admins.

> **Sla deze laag over** als je project geen onderscheid tussen rollen
> nodig heeft. De rest van de stack werkt zonder.

### Backend

```bash
git checkout upstream/main -- backend/src/db/migrations/003_users_role.sql
git checkout upstream/main -- backend/src/db/migrations/004_seed_admin.sql
git checkout upstream/main -- backend/src/middleware/requireRole.ts
```

> **Pas op** met `backend/src/services/authService.ts` en
> `backend/src/middleware/requireAuth.ts` en `backend/src/routes/auth.ts`.
> Als je daar zelf wijzigingen in hebt gemaakt: niet blind overschrijven.
> Vergelijk met `git diff upstream/main -- backend/src/services/authService.ts`
> en port handmatig de `role`-velden over.

Belangrijke wijzigingen die je moet integreren:
- `PublicUser` krijgt `role: 'admin' | 'user'`
- `registerUser`, `loginUser`, `getUserById` returnen `role` mee
- SQL-queries selecteren `role` mee

Eigen admin-route (optioneel):
```bash
git checkout upstream/main -- backend/src/routes/admin.ts
```

Mount in `server.ts`:
```ts
import adminRouter from './routes/admin'
app.use('/api/admin', adminRouter)
```

### Frontend

In `stores/auth.ts`:
```ts
export type User = { id: number; email: string; role: 'admin' | 'user' }

// in getters:
isAdmin: (s): boolean => s.user?.role === 'admin'
```

In `router/index.ts` voeg de guard toe:
```ts
if (to.meta.requiresRole && auth.user?.role !== to.meta.requiresRole) {
  return { path: '/' }
}
```

In `AppShell.vue` wrap admin-only sidebar-items:
```vue
<template v-if="auth.isAdmin">
  <div class="app-sidebar__section">Beheer</div>
  <RouterLink to="/admin" class="app-sidebar__link" ...>Beheerspanel</RouterLink>
</template>
```

### Migrations runnen

Gewoon je backend opstarten:
```bash
cd backend && npm run dev
# in de logs: [migration] applying 003_users_role.sql
#             [migration] applying 004_seed_admin.sql
```

### Login testen

```
http://localhost:5173/login
admin@appsys.local
appsys00
```

Wijzig dit wachtwoord direct na de eerste login als je naar production
gaat. Voor lokaal werk is het bewust een bekende default.

Commit:
```bash
git add -A
git commit -m "feat: add RBAC met admin/user-roles + seed-admin"
```

---

## PR openen

```bash
git push -u origin chore/appsys-stack-upgrade
gh pr create --title "Upgrade naar huidige AppSys-stack" --body "$(cat <<'EOF'
## Wat verandert

- **Laag 1** (verplicht): huisstijl-tokens, AppShell-component, ESLint, pre-commit hook, skills.
- **Laag 2** (aanbevolen): alle views in AppShell gewrapt.
- **Laag 3** (optioneel): RBAC met admin/user.

## Checklist

- [ ] `npm run lint` is clean.
- [ ] `npm test` is groen.
- [ ] `npm run dev` toont AppShell op alle ingelogde views.
- [ ] Als RBAC: `admin@appsys.local` / `appsys00` werkt.
- [ ] Pre-commit hook is actief (`git config core.hooksPath` retourneert `scripts/git-hooks`).

## Referenties

- Bron: https://github.com/BenjaminCes/AppSys-TemplateStack
- Migratie-guide: `MIGRATIE-bestaand-project.md`
EOF
)"
```

---

## Veelvoorkomende issues

| Symptoom | Oorzaak | Fix |
|---|---|---|
| `npm run lint` zegt `bg-blue-600 is not allowed` | Generieke Tailwind kleur-class gebruikt | Vervang door `brand-orange` (zie tabel hierboven) |
| Pre-commit hook draait niet | `core.hooksPath` niet geactiveerd | `git config core.hooksPath scripts/git-hooks` |
| Pre-commit zegt "hex gevonden" terwijl het in `<style>` van een Vue-file staat | Hook scant niet correct | Update naar laatste versie van `scripts/git-hooks/pre-commit` (skip `<style>`-blokken sinds versie 2026-04-28) |
| AppShell rendert niet, sidebar leeg | `auth.isAuthenticated` is false | Login eerst, of test met de seed-admin |
| RBAC-migratie faalt op bestaande users | `role`-kolom heeft `DEFAULT 'user'`, dat is OK | Geen actie nodig, bestaande users worden 'user' |
| ESLint klaagt over `vuetify` of andere UI-lib | Externe UI-lib geinstalleerd | Verwijder met `npm uninstall`, bouw eigen component |

---

## Wat je NIET overschrijft

Dit zijn de bestanden die de migratie bewust **niet** aanraakt, omdat
hier jouw eigen werk in zit:

- `backend/src/routes/<jouw-eigen-routes>.ts`
- `backend/src/services/<jouw-eigen-services>.ts`
- `backend/src/db/migrations/00*_<jouw-tabellen>.sql` (alleen de
  `003_users_role.sql` en `004_seed_admin.sql` komen er bij, geen
  bestaande migrations worden gewijzigd)
- `frontend/src/views/<jouw-eigen-views>.vue` (je wrapt ze in AppShell,
  meer niet)
- `frontend/src/stores/<jouw-eigen-stores>.ts`
- `frontend/src/router/index.ts` — alleen de admin-guard wordt
  toegevoegd, niet je routes
- `CLAUDE.md` Project Overview sectie (template heeft die leeg, jij hebt
  hem gevuld; behoud je versie)

Bij twijfel: eerst `git diff upstream/main -- <file>` draaien zodat je
ziet wat er precies anders is.

---

## Vragen

Open een issue op
`https://github.com/BenjaminCes/AppSys-TemplateStack/issues` of mail
benjamin.ceyssens@appsysictgroup.com.
