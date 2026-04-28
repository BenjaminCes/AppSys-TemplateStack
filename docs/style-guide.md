# Style Guide

Schrijfregels voor code, UI-tekst, documentatie en AI-output binnen elk
Claudebase-project.

## 1. Geen em-dashes

De em-dash (Unicode U+2014) is **verboden** in de volledige codebase, UI-tekst,
documentatie, AI-prompts en AI-output.

**Waarom:** de em-dash is een typisch kenmerk van LLM-gegenereerde tekst.
Onze projecten moeten leesbaar blijven als door een mens geschreven document.
Bovendien zijn em-dashes lastig te typen op Belgische toetsenborden en
breken ze vaak in kopieerbare CSV- of JSON-uitvoer.

**Alternatieven:**

| In plaats van           | Gebruik                              |
|-------------------------|--------------------------------------|
| Korte pauze in zin      | Komma `,`                            |
| Introductie/opsomming   | Dubbele punt `:`                     |
| Visuele break in titel  | En-dash `-` (U+2013), of herschrijf  |
| Lijstscheiding          | Nieuwe bullet                        |

**Voorbeelden** (de NIET-regels bevatten echte em-dashes ter illustratie):

```text
NIET:  Dit is een tool, gericht op MSP's, met AI-ondersteuning.
WEL:   Dit is een tool, gericht op MSP's, met AI-ondersteuning.

NIET:  Fase 1 - Voorbereiding
WEL:   Fase 1: Voorbereiding
OF:    Fase 1 - Voorbereiding

NIET:  Dit werkt, normaal.
WEL:   Dit werkt, normaal.
```

## 2. Geen typografische quotes

Gebruik rechte quotes (`"` en `'`), nooit de curly variants (U+201C, U+201D,
U+2018, U+2019). Curly quotes zijn een tweede LLM-tell en breken
copy-paste in JSON/CSV.

## 3. Geen "AI-tell" emoji's of bliksemschicht-iconen

In productie-UI nooit gebruiken: bliksemschicht (lightning-bolt), gloeilamp,
sparkles, raket, vuur, ster, check-box, cross-box, heavy-check, warn-driehoek.
Ook geen `BoltIcon`, `LightningBoltIcon` of `ZapIcon` imports. Reden: ze
positioneren het product als "AI-magic", we willen rust en professionaliteit.

## 4. Handhaving

- **Pre-commit hook**: scant staged `.vue/.ts/.tsx`-bestanden op em-dashes,
  curly quotes en bovenstaande emoji's. Faalt commit bij een hit.
  Activeert automatisch na `npm install` (postinstall draait
  `git config core.hooksPath scripts/git-hooks`).
- **ESLint**: blokkeert imports van externe UI-libraries en
  niet-`brand.*` Tailwind-kleur-classes. Faalt CI en pre-commit.
- **AI-prompts**: elke `callClaude()` of OpenRouter-call hoort de
  systeem-regel toe te voegen: *"Gebruik NOOIT een em-dash. Gebruik komma,
  dubbele punt, of en-dash (U+2013)."*
- **PR-review**: een reviewer die een em-dash of UI-lib laat passeren,
  krijgt een PR-comment met link naar dit document.

## 5. Uitzonderingen

- Dit document zelf bevat em-dashes ter illustratie.
- Binary-bestanden (`.docx`, `.pdf`, `.db`) worden niet gescand.
- Test-fixtures die juist de regex willen valideren, zijn opt-in toegestaan
  via een rij in de pre-commit hook (`grep -vE`).

## Overige conventies

Zie `CLAUDE.md` in project-root voor project-brede conventies (taal, kleuren,
huisstijl, RBAC, AI-output-regels).
