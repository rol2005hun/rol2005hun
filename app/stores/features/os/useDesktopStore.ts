import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useCookie } from '#imports';

export interface DesktopIconItem {
  id: string; // unique instance id
  appId: string; // the app it launches
  x: number;
  y: number;
}

export const useDesktopStore = defineStore('os-desktop', () => {
  const isStartMenuOpen = ref(false);

  const desktopIconsCookie = useCookie<DesktopIconItem[]>('os-desktop-icons', {
    default: () => [
      { id: 'icon-browser', appId: 'browser', x: 20, y: 20 },
      { id: 'icon-terminal', appId: 'terminal', x: 20, y: 120 },
      { id: 'icon-projects', appId: 'projects', x: 20, y: 220 },
      { id: 'icon-settings', appId: 'settings', x: 20, y: 320 },
      { id: 'icon-about', appId: 'about', x: 20, y: 420 },
    ],
    watch: true,
    maxAge: 31536000
  });

  const icons = ref<DesktopIconItem[]>(desktopIconsCookie.value || []);

  const toggleStartMenu = () => {
    isStartMenuOpen.value = !isStartMenuOpen.value;
  };

  const closeStartMenu = () => {
    isStartMenuOpen.value = false;
  };

  const updateIconPosition = (id: string, x: number, y: number) => {
    const icon = icons.value.find(i => i.id === id);
    if (icon) {
      icon.x = x;
      icon.y = y;
      desktopIconsCookie.value = [...icons.value];
    }
  };

  return {
    isStartMenuOpen,
    icons,
    toggleStartMenu,
    closeStartMenu,
    updateIconPosition,
  };
});
