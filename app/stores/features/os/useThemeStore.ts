import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
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

export const availableWallpapers = [
  { id: 'default', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400' },
  { id: 'mountains', url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&q=80&w=2070', thumb: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&q=80&w=400' },
  { id: 'ocean', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2073', thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400' },
  { id: 'abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2070', thumb: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400' },
  { id: 'city', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2144', thumb: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400' }
];

export const useThemeStore = defineStore('os-theme', () => {
  const themeCookie = useCookie<OSTheme>('os_theme', { default: () => 'dark' });
  const currentTheme = ref<OSTheme>(themeCookie.value || 'dark');

  const defaultWallpaper = availableWallpapers[0] || { id: 'default', url: '', thumb: '' };

  const wallpaperCookie = useCookie<string>('os_wallpaper', { default: () => defaultWallpaper.id });
  const currentWallpaper = ref<string>(wallpaperCookie.value || defaultWallpaper.id);

  const setTheme = (theme: OSTheme) => {
    currentTheme.value = theme;
    themeCookie.value = theme;
  };

  const setWallpaper = (wallpaperId: string) => {
    currentWallpaper.value = wallpaperId;
    wallpaperCookie.value = wallpaperId;
  };

  const toggleTheme = () => {
    setTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
  };

  const currentWallpaperUrl = computed(() => {
    const wp = availableWallpapers.find(w => w.id === currentWallpaper.value);
    return wp ? wp.url : defaultWallpaper.url;
  });

  watch(currentTheme, (newTheme) => {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  }, { immediate: true });

  return {
    currentTheme,
    availableThemes,
    currentWallpaper,
    currentWallpaperUrl,
    availableWallpapers,
    setTheme,
    setWallpaper,
    toggleTheme
  };
});
