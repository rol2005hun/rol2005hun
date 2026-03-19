import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useCookie } from '#imports';
import { useAppRegistry } from './useAppRegistry';

export interface DesktopIconItem {
  id: string;
  appId: string;
  x: number;
  y: number;
}

export const useDesktopStore = defineStore('os-desktop', () => {
  const isStartMenuOpen = ref(false);
  const selectedIcons = ref<string[]>([]);
  const appRegistry = useAppRegistry();

  const defaultIcons = computed<DesktopIconItem[]>(() => {
    return appRegistry.installedApps
      .filter((app) => app.showOnDesktop !== false)
      .map((app, index) => ({
        id: `icon-${app.id}`,
        appId: app.id,
        x: 20,
        y: 20 + index * 100
      }));
  });

  const desktopIconsCookie = useCookie<DesktopIconItem[]>('os-desktop-icons', {
    default: () => defaultIcons.value,
    watch: true,
    maxAge: 31536000
  });

  const icons = computed(() => {
    if (
      !desktopIconsCookie.value ||
      !Array.isArray(desktopIconsCookie.value) ||
      desktopIconsCookie.value.length === 0
    ) {
      return defaultIcons.value;
    }

    const currentAppIds = desktopIconsCookie.value.map((i) => i.appId);
    const missingApps = defaultIcons.value.filter((di) => !currentAppIds.includes(di.appId));

    if (missingApps.length > 0) {
      return [...desktopIconsCookie.value, ...missingApps];
    }

    return desktopIconsCookie.value;
  });

  const toggleStartMenu = () => {
    isStartMenuOpen.value = !isStartMenuOpen.value;
  };

  const closeStartMenu = () => {
    isStartMenuOpen.value = false;
  };

  const updateIconPosition = (id: string, x: number, y: number) => {
    const currentIcons = [...icons.value];
    const index = currentIcons.findIndex((i) => i.id === id);
    if (index !== -1) {
      currentIcons[index] = { ...currentIcons[index], x, y } as DesktopIconItem;
      desktopIconsCookie.value = currentIcons;
    }
  };

  const selectIcon = (id: string, ctrl: boolean = false) => {
    if (ctrl) {
      if (selectedIcons.value.includes(id)) {
        selectedIcons.value = selectedIcons.value.filter((i) => i !== id);
      } else {
        selectedIcons.value.push(id);
      }
    } else {
      selectedIcons.value = [id];
    }
  };

  const clearSelection = () => {
    selectedIcons.value = [];
  };

  const setSelection = (ids: string[]) => {
    selectedIcons.value = ids;
  };

  const resetIcons = () => {
    desktopIconsCookie.value = defaultIcons.value;
  };

  return {
    isStartMenuOpen,
    icons,
    selectedIcons,
    toggleStartMenu,
    closeStartMenu,
    updateIconPosition,
    selectIcon,
    clearSelection,
    setSelection,
    resetIcons
  };
});
