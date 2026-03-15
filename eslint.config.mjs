import withNuxt from './.nuxt/eslint.config.mjs';
import oxlint from 'eslint-plugin-oxlint';
import stylistic from '@stylistic/eslint-plugin';

export default withNuxt(
  oxlint.configs['flat/recommended'],
  {
    plugins: {
      '@stylistic': stylistic
    },
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'vue/html-quotes': ['error', 'double'],
      'vue/html-indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
);
