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
  const themeCookie = useCookie<OSTheme>('os-theme', {
    default: () => 'dark',
    watch: true,
    maxAge: 31536000
  });
  const currentTheme = ref<OSTheme>(themeCookie.value || 'dark');

  const defaultWallpaper = availableWallpapers[0] || { id: 'default', url: '', thumb: '' };

  const wallpaperCookie = useCookie<string>('os-wallpaper', {
    default: () => defaultWallpaper.id,
    watch: true,
    maxAge: 31536000
  });
  const currentWallpaper = ref<string>(wallpaperCookie.value || defaultWallpaper.id);

  const customWallpaperCookie = useCookie<string>('os-custom-wallpaper', {
    default: () => '',
    watch: true,
    maxAge: 31536000
  });
  const customWallpaperLocal = ref<string>('');

  if (import.meta.client) {
    if (customWallpaperCookie.value === 'localstorage') {
      setTimeout(() => {
        customWallpaperLocal.value = localStorage.getItem('os-custom-wallpaper') || '';
      }, 0);
    }
  }

  const customWallpaperData = computed(() => {
    return customWallpaperCookie.value === 'localstorage'
      ? customWallpaperLocal.value
      : customWallpaperCookie.value;
  });

  const setTheme = (theme: OSTheme) => {
    currentTheme.value = theme;
    themeCookie.value = theme;
  };

  const setWallpaper = (wallpaperId: string) => {
    currentWallpaper.value = wallpaperId;
    wallpaperCookie.value = wallpaperId;
  };

  const setCustomWallpaper = (dataUrl: string) => {
    // Cookie max size is ~4KB. Base64 uploads will exceed this heavily, so we only save short URLs in cookies (SSR friendly),
    // and route big file uploads securely into localStorage (client only) to prevent HTTP 431 errors.
    if (dataUrl.startsWith('data:image/') || dataUrl.length > 3000) {
      customWallpaperCookie.value = 'localstorage';
      customWallpaperLocal.value = dataUrl;
      if (import.meta.client) {
        try {
          localStorage.setItem('os-custom-wallpaper', dataUrl);
        } catch (e) {
          console.error('Failed to save image to localStorage', e);
        }
      }
    } else {
      customWallpaperCookie.value = dataUrl;
      if (import.meta.client) {
        localStorage.removeItem('os-custom-wallpaper');
      }
    }
    setWallpaper('custom');
  };

  const toggleTheme = () => {
    setTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
  };

  const currentWallpaperUrl = computed(() => {
    if (currentWallpaper.value === 'custom') {
      return customWallpaperData.value || defaultWallpaper.url;
    }
    const wp = availableWallpapers.find(w => w.id === currentWallpaper.value);
    return wp ? wp.url : defaultWallpaper.url;
  });

  watch(currentTheme, (newTheme) => {
    if (import.meta.client && newTheme) {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  }, { immediate: true });

  return {
    currentTheme,
    availableThemes,
    currentWallpaper,
    currentWallpaperUrl,
    customWallpaperData,
    availableWallpapers,
    setTheme,
    setWallpaper,
    setCustomWallpaper,
    toggleTheme
  };
});
