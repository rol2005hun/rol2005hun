// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'hu'
      },
      title: 'ranzak',
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css', crossorigin: 'anonymous' },
        { rel: 'icon', href: 'https://i.imgur.com/Z4uWZ64.jpg', type: 'image/x-icon' }
      ],
      meta: [
        { name: 'title', content: 'ranzak' },
        { name: 'description', content: 'less fel ide :D' }
      ]
    },
    rootId: 'app'
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
  }
})
