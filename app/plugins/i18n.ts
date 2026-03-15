import { createI18n } from 'vue-i18n';
import { useCookie } from '#imports';

type MessageSchema = {
  [key: string]: string | MessageSchema;
};

export default defineNuxtPlugin((nuxtApp) => {
  const messages: { [key: string]: MessageSchema } = {
    en: {}
  };

  const localeFiles = import.meta.glob('../locales/**/*.json', { eager: true, import: 'default' });

  for (const path in localeFiles) {
    const match = path.match(/\/locales\/.*\/(.+?)\/([a-z0-9-_]+)\.json$/i);
    if (match && match[1] && match[2]) {
      const namespace = match[1];
      const locale = match[2];
      const content = localeFiles[path] as MessageSchema;

      if (!messages[locale]) messages[locale] = {};

      const existing = (messages[locale][namespace] as MessageSchema) || {};
      messages[locale][namespace] = { ...existing, ...content };
    }
  }

  const localeCookie = useCookie('os_locale');

  const i18n = createI18n({
    legacy: false,
    locale: localeCookie.value || 'en',
    messages,
    globalInjection: true
  });

  nuxtApp.vueApp.use(i18n);
});
