export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app/',
  serverDir: 'server/',
  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxt/icon'
  ],
  css: [
    '~/assets/scss/main.scss'
  ],
  nitro: {
    experimental: {
      websocket: true
    }
  },
  vite: {
    optimizeDeps: {
      include: ['vue-i18n']
    }
  },
});
