import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig(
  {
    ignores: ['**/node_modules/**', 'assets/**'],
  },
  {
    files: ['**/*.{js}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      js,
    },
    extends: ['js/recommended'],
    rules: {
      'no-console': 'error',
    },
  },
  eslintConfigPrettier
);
