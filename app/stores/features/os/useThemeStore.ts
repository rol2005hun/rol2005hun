import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useCookie } from '#imports';

export type OSTheme = 'dark' | 'light' | 'orange' | 'purple' | 'green';

export interface ThemeConfig {
  id: OSTheme;
  nameKey: string;
  color: string;
}

export const availableThemes: ThemeConfig[] = [
  { id: 'dark', nameKey: 'os.themes.dark', color: '#1a1a1a' },
  { id: 'light', nameKey: 'os.themes.light', color: '#ffffff' },
  { id: 'orange', nameKey: 'os.themes.orange', color: '#ff7a00' },
  { id: 'purple', nameKey: 'os.themes.purple', color: '#9d00ff' },
  { id: 'green', nameKey: 'os.themes.green', color: '#00c853' },
];

export const useThemeStore = defineStore('os-theme', () => {
  const themeCookie = useCookie<OSTheme>('os_theme', { default: () => 'dark' });
  const currentTheme = ref<OSTheme>(themeCookie.value || 'dark');

  const setTheme = (theme: OSTheme) => {
    currentTheme.value = theme;
    themeCookie.value = theme;
  };

  const toggleTheme = () => {
    setTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
  };

  watch(currentTheme, (newTheme) => {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  }, { immediate: true });

  return {
    currentTheme,
    availableThemes,
    setTheme,
    toggleTheme
  };
});
