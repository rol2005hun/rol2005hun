import withNuxt from './.nuxt/eslint.config.mjs';
import oxlint from 'eslint-plugin-oxlint';

export default withNuxt(
  oxlint.configs['flat/recommended'],
  {
    ignores: ['.nuxt', '.output', 'node_modules', 'dist', 'public', 'package-lock.json']
  },
  {
    rules: {
      'vue/html-self-closing': 'off',
      'vue/no-v-html': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  },
  {
    files: ['**/*.ts', '**/*.mts', '**/*.vue'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'warn'
    }
  }
);
