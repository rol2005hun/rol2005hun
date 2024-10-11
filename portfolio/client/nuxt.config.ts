// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtConfig } from '@nuxt/types';

const config: NuxtConfig = {
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
        { name: 'description', content: 'Ranyák Roland a nevem, 17 éves vagyok, full-stack fejlesztő, jelenleg a Nuxt.js-t tanulom' }
      ]
    },
    rootId: 'app'
  },
  static: {
    directory: 'static'
  },
  buildModules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:1225',
    }
  }
}

export default config;