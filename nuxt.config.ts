export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: 'ranzakOS v3',
      link: [{ rel: 'icon', type: 'image/jpeg', href: '/logo.JPG' }]
    }
  },
  runtimeConfig: {
    adminPassword: process.env.VITE_ADMIN_PASSWORD,
    public: {}
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app/',
  serverDir: 'server/',
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/icon'],
  css: ['@/assets/scss/main.scss'],
  routeRules: {
    '/': { prerender: true }
  },
  vite: {
    optimizeDeps: {
      include: ['vue-i18n']
    }
  }
});
