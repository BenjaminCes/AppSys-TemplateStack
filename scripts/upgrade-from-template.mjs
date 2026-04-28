#!/usr/bin/env node
/**
 * Interactieve upgrade van een bestaande fork naar de huidige
 * AppSys-TemplateStack. Werkt op Windows, macOS en Linux. Geen extra
 * dependencies nodig: alleen Node 18+ (ingebouwde readline + child_process).
 *
 * Gebruik vanuit de root van je fork:
 *   node scripts/upgrade-from-template.mjs
 *
 * Of via npm-script:
 *   npm run upgrade-from-template
 *
 * Wat het doet:
 *   1. Voegt upstream-remote toe (eenmalig) en doet `git fetch upstream`.
 *   2. Vraagt per laag of je hem wil binnenhalen:
 *        Laag 1: huisstijl + ESLint + pre-commit hook + skills (verplicht)
 *        Laag 2: AppShell layout (aanbevolen)
 *        Laag 3: RBAC met admin/user-rol (optioneel)
 *   3. Doet `git checkout upstream/main -- <files>` per gekozen laag.
 *   4. Toont een samenvatting met de vervolgstappen.
 *
 * Veiligheid:
 *   - Werkt in een nieuwe branch (`chore/appsys-stack-upgrade`); je main
 *     blijft onaangeroerd.
 *   - Stopt direct als je working tree niet clean is.
 *   - Raakt JOUW eigen views/routes/migrations niet aan; alleen de files
 *     die expliciet bij een laag horen.
 */

import { execSync, spawnSync } from 'node:child_process'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout, exit } from 'node:process'

const UPSTREAM_REMOTE_NAME = 'upstream'
const UPSTREAM_URL = 'https://github.com/BenjaminCes/AppSys-TemplateStack.git'
const UPGRADE_BRANCH = 'chore/appsys-stack-upgrade'

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
}

function color(c, s) {
  return `${COLORS[c]}${s}${COLORS.reset}`
}

function log(msg)  { console.log(msg) }
function ok(msg)   { console.log(color('green', '[ok] ') + msg) }
function info(msg) { console.log(color('cyan', '[i]  ') + msg) }
function warn(msg) { console.log(color('yellow', '[!]  ') + msg) }
function err(msg)  { console.error(color('red', '[x]  ') + msg) }

function git(args, opts = {}) {
  const r = spawnSync('git', args, { stdio: 'pipe', encoding: 'utf8', ...opts })
  if (r.status !== 0 && !opts.allowFail) {
    err(`git ${args.join(' ')} faalde:\n${r.stderr || r.stdout}`)
    exit(1)
  }
  return { code: r.status ?? 1, stdout: (r.stdout || '').trim(), stderr: (r.stderr || '').trim() }
}

function gitTry(args) {
  return git(args, { allowFail: true })
}

const LAYER_1_FILES = [
  'frontend/tailwind.config.js',
  'frontend/src/style.css',
  'frontend/index.html',
  'frontend/public/brand',
  '.eslintrc.cjs',
  'frontend/.eslintrc.cjs',
  'backend/.eslintrc.cjs',
  'scripts/git-hooks',
  'docs/style-guide.md',
  'docs/UX-DESIGN.md',
  'docs/STACK-STANDARD.md',
  'onboarding/skills',
  'onboarding/install-skills.ps1',
  'onboarding/install-skills.sh',
  'onboarding/agents'
]

const LAYER_2_FILES = [
  'frontend/src/components/layout',
  'frontend/src/types/domain.ts',
  'frontend/src/stores/items.ts'
]

const LAYER_3_FILES = [
  'backend/src/db/migrations/003_users_role.sql',
  'backend/src/db/migrations/004_seed_admin.sql',
  'backend/src/middleware/requireRole.ts',
  'backend/src/routes/admin.ts'
]

async function ask(rl, question, defaultYes = true) {
  const hint = defaultYes ? '[Y/n]' : '[y/N]'
  const a = (await rl.question(`${color('bold', question)} ${color('gray', hint)} `)).trim().toLowerCase()
  if (a === '') return defaultYes
  return a === 'y' || a === 'yes' || a === 'j' || a === 'ja'
}

function ensureCleanWorkingTree() {
  const r = git(['status', '--porcelain'])
  if (r.stdout.length > 0) {
    err('Je working tree is niet clean. Commit, stash of revert eerst:')
    log(r.stdout)
    exit(1)
  }
}

function ensureUpstream() {
  const remotes = git(['remote'])
  const has = remotes.stdout.split('\n').some(l => l.trim() === UPSTREAM_REMOTE_NAME)
  if (has) {
    info(`Remote '${UPSTREAM_REMOTE_NAME}' bestaat al, sla setup over.`)
  } else {
    info(`Voeg upstream-remote toe: ${UPSTREAM_URL}`)
    git(['remote', 'add', UPSTREAM_REMOTE_NAME, UPSTREAM_URL])
    ok(`Remote '${UPSTREAM_REMOTE_NAME}' toegevoegd.`)
  }
  info(`Fetch upstream...`)
  git(['fetch', UPSTREAM_REMOTE_NAME], { stdio: 'inherit' })
  ok('Upstream up-to-date.')
}

function ensureUpgradeBranch() {
  const current = git(['rev-parse', '--abbrev-ref', 'HEAD']).stdout
  if (current === UPGRADE_BRANCH) {
    info(`Je staat al op '${UPGRADE_BRANCH}'.`)
    return
  }
  const exists = gitTry(['rev-parse', '--verify', UPGRADE_BRANCH]).code === 0
  if (exists) {
    info(`Branch '${UPGRADE_BRANCH}' bestaat, switch ernaartoe.`)
    git(['checkout', UPGRADE_BRANCH])
  } else {
    info(`Maak nieuwe branch '${UPGRADE_BRANCH}'.`)
    git(['checkout', '-b', UPGRADE_BRANCH])
  }
  ok(`Op branch '${UPGRADE_BRANCH}'.`)
}

function checkoutFiles(label, files) {
  log('')
  info(`${label}: ${files.length} pad(en) ophalen...`)
  for (const f of files) {
    const r = gitTry(['checkout', `${UPSTREAM_REMOTE_NAME}/main`, '--', f])
    if (r.code === 0) {
      ok(`  ${f}`)
    } else {
      warn(`  ${f}: niet gevonden in upstream (overgeslagen)`)
    }
  }
}

function printNextSteps(layersChosen) {
  log('')
  log(color('bold', 'Klaar. Vervolgstappen:'))
  log('')
  log('  1. Inspecteer de gewijzigde files:')
  log(color('gray', '       git status'))
  log(color('gray', '       git diff --staged'))
  log('')
  log('  2. Installeer nieuwe dev-deps en activeer de pre-commit hook:')
  log(color('gray', '       npm run install:all'))
  log('     (postinstall zet automatisch git config core.hooksPath scripts/git-hooks)')
  log('')
  log('  3. Run de lint, fix wat overschiet met --fix:')
  log(color('gray', '       npm run lint'))
  log(color('gray', '       npm run lint:fix'))
  log('')
  log('  4. Run je tests om te valideren dat niks bestaand kapot ging:')
  log(color('gray', '       npm test'))
  log('')

  if (layersChosen.includes(2)) {
    log('  5. Wrap je bestaande views in <AppShell> (zie MIGRATIE-bestaand-project.md sectie Laag 2).')
    log('')
  }
  if (layersChosen.includes(3)) {
    log('  6. Login als seed-admin om RBAC te testen:')
    log(color('gray', '       email: admin@appsys.local'))
    log(color('gray', '       wachtwoord: appsys00'))
    log('     Wijzig dit direct als je naar production gaat.')
    log('')
  }

  log('  7. Commit per laag, dan push + PR:')
  log(color('gray', `       git commit -m "chore: upgrade huisstijl + guardrails (laag ${layersChosen.join('+')})"`))
  log(color('gray', `       git push -u origin ${UPGRADE_BRANCH}`))
  log(color('gray', `       gh pr create`))
  log('')
}

async function main() {
  log(color('bold', '== AppSys-TemplateStack upgrade =='))
  log('')

  log('Controleer working tree...')
  ensureCleanWorkingTree()
  ok('Clean.')
  log('')

  log('Controleer upstream-remote...')
  ensureUpstream()
  log('')

  log('Maak upgrade-branch...')
  ensureUpgradeBranch()
  log('')

  const rl = createInterface({ input: stdin, output: stdout })
  log(color('bold', 'Welke lagen wil je nu binnenhalen?'))
  log('')
  log(`  ${color('cyan', 'Laag 1')} ${color('gray', '(verplicht)')}: huisstijl-tokens, AppShell-CSS, ESLint configs, pre-commit`)
  log(`           hook, skills, docs (style-guide, UX-DESIGN, STACK-STANDARD).`)
  log(`           Geen impact op je eigen routes of views.`)
  log('')
  log(`  ${color('cyan', 'Laag 2')} ${color('gray', '(aanbevolen)')}: AppShell-component + items-store + types.`)
  log(`           Hierna wrap je je views handmatig in <AppShell>.`)
  log('')
  log(`  ${color('cyan', 'Laag 3')} ${color('gray', '(optioneel)')}: RBAC-migrations + requireRole-middleware + admin-route.`)
  log(`           Sla over als je geen rollen-onderscheid nodig hebt.`)
  log('')

  const wantL1 = await ask(rl, 'Laag 1 binnenhalen?', true)
  const wantL2 = wantL1 ? await ask(rl, 'Laag 2 binnenhalen?', true) : false
  const wantL3 = wantL1 ? await ask(rl, 'Laag 3 binnenhalen?', false) : false
  rl.close()

  if (!wantL1 && !wantL2 && !wantL3) {
    warn('Geen lagen gekozen. Niets gewijzigd.')
    exit(0)
  }

  const chosen = []
  if (wantL1) { checkoutFiles('Laag 1 (huisstijl + guardrails + skills)', LAYER_1_FILES); chosen.push(1) }
  if (wantL2) { checkoutFiles('Laag 2 (AppShell)',                         LAYER_2_FILES); chosen.push(2) }
  if (wantL3) { checkoutFiles('Laag 3 (RBAC)',                              LAYER_3_FILES); chosen.push(3) }

  printNextSteps(chosen)
}

main().catch(e => {
  err(e?.stack || String(e))
  exit(1)
})
