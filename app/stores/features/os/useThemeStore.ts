import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import { useCookie } from '#imports';

export type OSTheme =
  | 'dark'
  | 'light'
  | 'orange'
  | 'purple'
  | 'green'
  | 'rose'
  | 'cyan'
  | 'dracula';

export interface ThemeConfig {
  id: OSTheme;
  nameKey: string;
  color: string;
}

export const availableThemes: ThemeConfig[] = [
  { id: 'dark', nameKey: 'os.themes.dark', color: '#1a1a1a' },
  { id: 'light', nameKey: 'os.themes.light', color: '#f5f5f8' },
  { id: 'orange', nameKey: 'os.themes.orange', color: '#ff7a00' },
  { id: 'purple', nameKey: 'os.themes.purple', color: '#9d00ff' },
  { id: 'green', nameKey: 'os.themes.green', color: '#00c853' },
  { id: 'rose', nameKey: 'os.themes.rose', color: '#f43f5e' },
  { id: 'cyan', nameKey: 'os.themes.cyan', color: '#06b6d4' },
  { id: 'dracula', nameKey: 'os.themes.dracula', color: '#282a36' }
];

export const availableWallpapers = [
  {
    id: 'default',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070',
    thumb:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'mountains',
    url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&q=80&w=2070',
    thumb:
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'ocean',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2073',
    thumb:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'abstract',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2070',
    thumb:
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'city',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2144',
    thumb:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400'
  }
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

  const accentColorCookie = useCookie<string>('os-accent-color', {
    default: () => '',
    watch: true,
    maxAge: 31536000
  });
  const accentColor = ref<string>(accentColorCookie.value || '');

  const showWidgetsCookie = useCookie<boolean>('os-show-widgets', {
    default: () => true,
    watch: true,
    maxAge: 31536000
  });
  const showWidgets = ref<boolean>(
    showWidgetsCookie.value !== undefined ? showWidgetsCookie.value : true
  );

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

  const setAccentColor = (color: string) => {
    accentColor.value = color;
    accentColorCookie.value = color;
    applyAccentColor(color);
  };

  const toggleWidgets = () => {
    showWidgets.value = !showWidgets.value;
    showWidgetsCookie.value = showWidgets.value;
  };

  const applyAccentColor = (color: string) => {
    if (!import.meta.client) return;
    if (color) {
      document.documentElement.style.setProperty('--os-primary-color', color);
      // Derive a border color with low opacity
      document.documentElement.style.setProperty('--os-border-color', `${color}33`);
    } else {
      document.documentElement.style.removeProperty('--os-primary-color');
      document.documentElement.style.removeProperty('--os-border-color');
    }
  };

  const toggleTheme = () => {
    setTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
  };

  const currentWallpaperUrl = computed(() => {
    if (currentWallpaper.value === 'custom') {
      return customWallpaperData.value || defaultWallpaper.url;
    }
    const wp = availableWallpapers.find((w) => w.id === currentWallpaper.value);
    return wp ? wp.url : defaultWallpaper.url;
  });

  watch(
    [currentTheme, accentColor],
    ([newTheme, newAccent]) => {
      if (import.meta.client) {
        if (newTheme) document.documentElement.setAttribute('data-theme', newTheme);
        applyAccentColor(newAccent);
      }
    },
    { immediate: true }
  );

  return {
    currentTheme,
    availableThemes,
    currentWallpaper,
    currentWallpaperUrl,
    customWallpaperData,
    availableWallpapers,
    accentColor,
    showWidgets,
    setTheme,
    setWallpaper,
    setCustomWallpaper,
    setAccentColor,
    toggleWidgets,
    toggleTheme
  };
});
