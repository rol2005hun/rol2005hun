import { NuxtConfig } from '@nuxt/types';

const config: NuxtConfig = {
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'hu'
      },
      title: 'Are you alive?',
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css', crossorigin: 'anonymous' },
        { rel: 'icon', href: 'https://i.imgur.com/uYWgYwg.png', type: 'image/x-icon' }
      ],
      meta: [
        { name: 'title', content: 'Are you alive?' },
        { name: 'description', content: 'You can check here, if you\'re alive. Easily. Safely. Fast.' }
      ]
    },
    rootId: 'app'
  },
  buildModules: ['@pinia/nuxt'],
}

export default config;