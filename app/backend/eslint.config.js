export default [
  {
    files: ['**/*.js'], // only check file .js
    rules: {
      semi: 'error', // force semicolons
      'no-unused-vars': 'warn', // warn if variables are unused
      'no-console': 'off', // backend need console.log
      'no-undef': 'error', // error if use undefined vars
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
];
