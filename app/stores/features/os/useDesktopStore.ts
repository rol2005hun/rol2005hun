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
      .filter((app) => {
        if (app.showOnDesktop === false) return false;
        if (Array.isArray(app.showOnDesktop) && !app.showOnDesktop.includes('desktop'))
          return false;
        return true;
      })
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

  const ensureIconsInBounds = (width: number, height: number) => {
    if (!desktopIconsCookie.value) return;

    let updated = false;
    const currentIcons = [...icons.value];

    const iconWidth = 80;
    const iconHeight = 100;
    const paddingX = 20;
    const paddingY = 20;
    const taskbarHeight = 60;
    const availableHeight = height - taskbarHeight;
    const maxRows = Math.floor((availableHeight - paddingY) / iconHeight) || 1;

    currentIcons.forEach((icon, index) => {
      let { x, y } = icon;
      let changed = false;

      if (x < 0 || y < 0 || x + iconWidth > width || y + iconHeight > availableHeight) {
        // Reflow out of bounds icon to grid
        y = paddingY + (index % maxRows) * iconHeight;
        x = paddingX + Math.floor(index / maxRows) * (iconWidth + paddingX);
        changed = true;
      }

      if (changed) {
        currentIcons[index] = { ...icon, x, y };
        updated = true;
      }
    });

    if (updated) {
      desktopIconsCookie.value = currentIcons;
    }
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
    resetIcons,
    ensureIconsInBounds
  };
});
