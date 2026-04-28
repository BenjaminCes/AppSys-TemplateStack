# UX-Design

Verplicht voor elk project onder `C:\Claudebase\`. Wijk hier alleen van af
met een ADR in `docs/adr/` en een onderbouwing in
`ARCHITECTURE.md#Stack-afwijkingen`.

## Design-principes

1. **Rust** - elk scherm heeft 1 primaire actie (oranje knop), de rest is
   secundair. Geen kleurfeesten, geen overbodige badges.
2. **Helderheid** - tekst-eerst, iconen ondersteunen. Geen iconografie als
   decoratie. Mono-font alleen voor data, IDs, code en eyebrows.
3. **Snelheid** - skeleton/spinner < 1s, anders progress. Ctrl+K-search
   altijd beschikbaar in de topbar.
4. **Herkenbaarheid** - elke ingelogde view zit binnen `AppShell`. Een
   gebruiker mag op geen enkele pagina twijfelen "is dit nog dezelfde app".

## Visual language

| Element             | Token / Waarde                                       |
|---------------------|------------------------------------------------------|
| Primaire kleur      | `brand.orange` `#F1860B` (hover `#d9770a`)           |
| Sidebar-achtergrond | `brand.navy` `#252A3A` (gradient `#1f2432 -> #1a1f2c`) |
| Status-positief     | `brand.green` `#A0C554`                              |
| Status-info         | `brand.cyan` `#37BEEA`                               |
| Neutraal            | Tailwind `gray-*` (50 t/m 900)                       |
| Typografie body     | Inter (400/500/600/700)                              |
| Typografie display  | Inter Tight (600/700/800) - voor h1, page-titles     |
| Typografie data     | JetBrains Mono - voor IDs, slugs, code, eyebrows     |
| Iconen              | Heroicons stroke (24x24, stroke-width 2)             |
| Radius              | 6px klein (buttons), 8px medium (cards), 12px hero   |
| Spacing             | Tailwind 2/3/4/6/8 (geen 5 of 7)                     |

**Hex-codes mogen alleen in `tailwind.config.js`, `style.css`,
`public/brand/*` en binnen `<style>...</style>`-blokken van `.vue`-files
voorkomen.** In `<template>`/`<script>` van .vue en in `.ts/.tsx`:
token-only via Tailwind-classes zoals `bg-brand-orange`, `text-brand-navy`,
`border-gray-200`.

**Geblokkeerde Tailwind-kleur-classes** (pre-commit hook blokkeert):
`bg-orange-*`, `bg-amber-*`, `bg-yellow-*`, `bg-lime-*`, `bg-green-*`,
`bg-emerald-*`, `bg-teal-*`, `bg-cyan-*`, `bg-sky-*`, `bg-blue-*`,
`bg-indigo-*`, `bg-violet-*`, `bg-purple-*`, `bg-fuchsia-*`, `bg-pink-*`,
`bg-rose-*` (en hetzelfde voor `text-`, `border-`, `from-`, `to-`, `via-`,
`ring-`, `divide-`, `placeholder-`, `caret-`, `outline-`, `fill-`,
`stroke-`, `shadow-`).

Toegestaan: `brand.*`, `gray-*`, `slate-*`, `red-*` (uitsluitend voor
error-states, dat is een universele a11y-conventie), `white`, `black`,
`transparent`, `current`.

## Layout-patronen

**AppShell verplicht voor elke ingelogde view.** Bron:
`frontend/src/components/layout/AppShell.vue`. Bevat sidebar (links, navy
gradient) plus topbar (boven, wit) plus slot voor content. Wrap je view
als `<AppShell page-title="..." eyebrow="..."><div>...</div></AppShell>`.

Auth-views (`/login`, `/register`) staan **buiten** AppShell. Geen sidebar
op die schermen.

**Sidebar-secties** worden bepaald door rol:
- `Werkruimte` - voor alle ingelogde gebruikers (de domein-features van het
  project).
- `Beheer` - alleen zichtbaar als `auth.isAdmin === true`. Bevat o.a. de
  beheerspanel-link.

## Interactie-regels

- **Ctrl+K** opent / focust de zoekbalk in de topbar (overal).
- **Esc** sluit modals, dropdowns en de zoek-resultatenlijst.
- **Toast-meldingen** voor success/error (geen `alert()`).
- **Bevestigingsdialoog** bij destructieve acties (delete, irreversible
  state-change).
- **Focus-rings** zichtbaar (Tailwind `focus:ring-brand-orange/30`).
- **Keyboard-shortcuts** (lijst per project documenteren).

## Formulieren

- Verplichte velden markeren met `*` na het label.
- Validatie-errors **onder** het veld, in `text-red-600 text-xs`. Geen
  toast-meldingen voor inline-validatie.
- Datumformaat in UI: `dd-mm-jjjj`. Datums van API: ISO-8601.
- Inputs hebben `autocomplete`-attributen waar nuttig.

## Empty-states

Standaard-pattern:
1. Compact illustratief icoon (Heroicons stroke, 32x32, in `text-gray-300`).
2. Korte regel: "Geen X gevonden".
3. Subregel met de hint hoe te beginnen.
4. Optionele primaire knop ("Eerste X aanmaken").

Voorbeeld in HomeView en AdminView (lege lijsten).

## Accessibility

- WCAG AA contrast op alle tekst (minimum 4.5:1 voor body, 3:1 voor large).
- Alles tab-bereikbaar; tab-volgorde volgt visuele volgorde.
- `aria-label` op iconen-only buttons (sidebar-burger, search-icon).
- Modals: `role="dialog"` + focus-trap + Esc om te sluiten.

## Iconen-regels

- **Heroicons stroke** is de standaard. Geen Lucide, geen Material Icons
  binnen 1 project.
- **Verboden**: bliksemschicht (`BoltIcon`, `LightningBoltIcon`, `ZapIcon`),
  AI-tell-emojis (lightbulb, sparkles, rocket, fire, star, check-box,
  cross-box, heavy-check, warn). Pre-commit hook blokkeert deze.

## Externe UI-libs

Niet toegestaan zonder ADR + onderbouwing in `ARCHITECTURE.md`:
`vuetify`, `bootstrap`, `primevue`, `quasar`, `@mui/*`, `@chakra-ui/*`,
`element-plus`, `naive-ui`, `ant-design-vue`. ESLint
`no-restricted-imports` blokkeert ze in code.

## Referentie

- `ARCHITECTURE.md` - technische componenten en stack-afwijkingen.
- `style-guide.md` - schrijfregels (em-dash, quotes, emoji-blocklist).
- `STACK-STANDARD.md` - bedrijfsbrede stack.
- `../CLAUDE.md` - overkoepelende project-regels.
