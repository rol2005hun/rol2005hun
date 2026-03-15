import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useCookie } from '#imports';

export const useThemeStore = defineStore('os-theme', () => {
  const themeCookie = useCookie<'light' | 'dark'>('os_theme', { default: () => 'dark' });
  const currentTheme = ref<'light' | 'dark'>(themeCookie.value || 'dark');

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark';
    themeCookie.value = currentTheme.value;
  };

  watch(currentTheme, (newTheme) => {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  }, { immediate: true });

  return {
    currentTheme,
    toggleTheme
  };
});
