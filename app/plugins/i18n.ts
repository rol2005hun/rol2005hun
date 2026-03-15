import { createI18n } from 'vue-i18n';

type MessageSchema = {
  [key: string]: string | MessageSchema;
};

export default defineNuxtPlugin((nuxtApp) => {
  const messages: { en: MessageSchema; [key: string]: MessageSchema } = {
    en: {}
  };

  const localeFiles = import.meta.glob([
    '../components/**/locales/*.json',
    '../shared/**/locales/*.json'
  ], { eager: true, import: 'default' });

  for (const path in localeFiles) {
    const match = path.match(/\/([^/]+)\/locales\/([a-z0-9-_]+)\.json$/i);
    if (match && match[1] && match[2]) {
      const feature = match[1];
      const locale = match[2];
      const content = localeFiles[path] as MessageSchema;

      if (!messages[locale]) messages[locale] = {};

      if (feature === 'shared') {
        messages[locale] = { ...messages[locale], ...content };
      } else {
        const existing = (messages[locale][feature] as MessageSchema) || {};
        messages[locale][feature] = { ...existing, ...content };
      }
    }
  }

  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages,
    globalInjection: true
  });

  nuxtApp.vueApp.use(i18n);
});
