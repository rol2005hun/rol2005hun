import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useCookie } from '#imports';

export type OSTheme = 'dark' | 'light' | 'orange' | 'purple' | 'green';

export interface ThemeConfig {
  id: OSTheme;
  name: string;
  color: string;
}

export const availableThemes: ThemeConfig[] = [
  { id: 'dark', name: 'Dark Mode', color: '#1a1a1a' },
  { id: 'light', name: 'Light Mode', color: '#ffffff' },
  { id: 'orange', name: 'Sunset Orange', color: '#ff7a00' },
  { id: 'purple', name: 'Cyber Purple', color: '#9d00ff' },
  { id: 'green', name: 'Forest Green', color: '#00c853' },
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
