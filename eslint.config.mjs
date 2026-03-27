import withNuxt from './.nuxt/eslint.config.mjs';
import oxlint from 'eslint-plugin-oxlint';

export default withNuxt(
  oxlint.configs['flat/recommended'],
  {
    ignores: ['patch_modal.js', '.eslintignore']
  },
  {
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'vue/html-self-closing': 'off',
      'vue/no-v-html': 'off'
    }
  }
);
