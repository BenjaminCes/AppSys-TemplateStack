module.exports = {
  root: false,
  extends: [
    '../.eslintrc.cjs',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  ignorePatterns: ['dist/', 'node_modules/', 'data/'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    // Geen template-strings met interpolatie als argument van db.prepare/run/exec.
    // Forceert parameterized queries (? placeholders) en voorkomt SQL-injectie.
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.property.name=/^(prepare|run|exec)$/] > TemplateLiteral[expressions.length>0]",
        message: 'Geen template-string interpolatie in SQL. Gebruik parameterized queries met ? placeholders.'
      }
    ]
  }
}
