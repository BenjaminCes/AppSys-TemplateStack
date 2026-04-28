// Base ESLint-config voor heel het Claudebase-template-project. Frontend en
// backend extenden deze met hun eigen plugin-configuraties. De primaire
// guardrail hier is no-restricted-imports: externe UI-libs zijn dichtgetimmerd
// volgens docs/STACK-STANDARD.md. Aanvullende regex-checks (Tailwind
// kleur-classes, hex-codes, em-dashes) gebeuren in de pre-commit hook.

const FORBIDDEN_UI_LIBS = [
  { name: 'vuetify',          message: 'Externe UI-lib niet toegestaan. Bouw componenten in frontend/src/components/ met brand.* tokens. Zie docs/UX-DESIGN.md en STACK-STANDARD.md.' },
  { name: 'bootstrap',        message: 'Externe UI-lib niet toegestaan. Zie docs/STACK-STANDARD.md.' },
  { name: 'bootstrap-vue',    message: 'Externe UI-lib niet toegestaan.' },
  { name: 'primevue',         message: 'Externe UI-lib niet toegestaan.' },
  { name: 'quasar',           message: 'Externe UI-lib niet toegestaan.' },
  { name: 'element-plus',     message: 'Externe UI-lib niet toegestaan.' },
  { name: 'naive-ui',         message: 'Externe UI-lib niet toegestaan.' },
  { name: 'ant-design-vue',   message: 'Externe UI-lib niet toegestaan.' },
  { name: 'styled-components',message: 'CSS-in-JS niet toegestaan. Gebruik Tailwind + brand-tokens.' }
]

const FORBIDDEN_UI_LIB_PATTERNS = [
  { group: ['@mui/*'],      message: 'Externe UI-lib niet toegestaan.' },
  { group: ['@chakra-ui/*'],message: 'Externe UI-lib niet toegestaan.' },
  { group: ['@emotion/*'],  message: 'CSS-in-JS niet toegestaan.' }
]

module.exports = {
  root: true,
  env: { node: true, es2022: true, browser: true },
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  ignorePatterns: ['dist/', 'node_modules/', '*.cjs', 'data/', 'build/'],
  rules: {
    'no-restricted-imports': ['error', {
      paths: FORBIDDEN_UI_LIBS,
      patterns: FORBIDDEN_UI_LIB_PATTERNS
    }]
  }
}
