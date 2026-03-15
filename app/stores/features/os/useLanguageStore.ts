import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useCookie } from '#imports';
import { useI18n } from 'vue-i18n';

export const useLanguageStore = defineStore('os-language', () => {
  const { locale } = useI18n();
  const langCookie = useCookie<'en' | 'hu'>('os_locale', { default: () => 'en' });
  const currentLanguage = ref<'en' | 'hu'>(langCookie.value || 'en');

  const setLanguage = (lang: 'en' | 'hu') => {
    currentLanguage.value = lang;
    langCookie.value = lang;
    locale.value = lang;
  };

  watch(currentLanguage, (newLang) => {
    locale.value = newLang;
  }, { immediate: true });

  return {
    currentLanguage,
    setLanguage
  };
});
