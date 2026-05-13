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
  const isControlCenterOpen = ref(false);
  const isSearchOpen = ref(false);
  const taskbarPositionCookie = useCookie<'bottom' | 'top' | 'left' | 'right'>('os-taskbar-pos', {
    default: () => 'bottom',
    watch: true,
    maxAge: 31536000
  });
  const taskbarPosition = ref(taskbarPositionCookie.value || 'bottom');
  const isTaskbarFloatingCookie = useCookie<boolean>('os-taskbar-floating', {
    default: () => true,
    watch: true,
    maxAge: 31536000
  });
  const isTaskbarFloating = ref(isTaskbarFloatingCookie.value ?? true);
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
    if (isStartMenuOpen.value) {
      isControlCenterOpen.value = false;
      isSearchOpen.value = false;
    }
  };

  const closeStartMenu = () => {
    isStartMenuOpen.value = false;
  };

  const toggleControlCenter = () => {
    isControlCenterOpen.value = !isControlCenterOpen.value;
    if (isControlCenterOpen.value) {
      isStartMenuOpen.value = false;
      isSearchOpen.value = false;
    }
  };

  const closeControlCenter = () => {
    isControlCenterOpen.value = false;
  };

  const toggleSearch = () => {
    isSearchOpen.value = !isSearchOpen.value;
    if (isSearchOpen.value) {
      isStartMenuOpen.value = false;
      isControlCenterOpen.value = false;
    }
  };

  const closeSearch = () => {
    isSearchOpen.value = false;
  };

  const setTaskbarPosition = (pos: 'bottom' | 'top' | 'left' | 'right') => {
    taskbarPosition.value = pos;
    taskbarPositionCookie.value = pos;
  };

  const toggleTaskbarFloating = () => {
    isTaskbarFloating.value = !isTaskbarFloating.value;
    isTaskbarFloatingCookie.value = isTaskbarFloating.value;
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
    const taskbarSize = 60;

    let availableHeight = height;
    let startX = 0;
    let startY = 0;

    if (taskbarPosition.value === 'bottom') {
      availableHeight -= taskbarSize;
    } else if (taskbarPosition.value === 'top') {
      availableHeight -= taskbarSize;
      startY = taskbarSize;
    } else if (taskbarPosition.value === 'left') {
      startX = taskbarSize;
    } else if (taskbarPosition.value === 'right') {
      // reserved for future use if needed
    }

    const maxRows = Math.floor((availableHeight - paddingY) / iconHeight) || 1;

    const occupied = new Set<string>();

    const getCell = (x: number, y: number) => {
      const col = Math.max(0, Math.round((x - paddingX - startX) / (iconWidth + paddingX)));
      const row = Math.max(0, Math.round((y - paddingY - startY) / iconHeight));
      return { col, row };
    };

    currentIcons.forEach((icon) => {
      const { x, y } = icon;
      const isOutOfBounds =
        x < startX ||
        y < startY ||
        x + iconWidth > width - (taskbarPosition.value === 'right' ? taskbarSize : 0) ||
        y + iconHeight > height - (taskbarPosition.value === 'bottom' ? taskbarSize : 0);
      if (!isOutOfBounds) {
        const { col, row } = getCell(x, y);
        occupied.add(`${col},${row}`);
      }
    });

    const findNextAvailableCell = () => {
      let col = 0;
      let row = 0;
      while (occupied.has(`${col},${row}`)) {
        row++;
        if (row >= maxRows) {
          row = 0;
          col++;
        }
      }
      return { col, row };
    };

    currentIcons.forEach((icon, index) => {
      const { x, y } = icon;
      const isOutOfBounds =
        x < 0 || y < 0 || x + iconWidth > width || y + iconHeight > availableHeight;

      if (isOutOfBounds) {
        const { col, row } = findNextAvailableCell();
        occupied.add(`${col},${row}`);

        const newX = paddingX + startX + col * (iconWidth + paddingX);
        const newY = paddingY + startY + row * iconHeight;

        if (newX !== x || newY !== y) {
          currentIcons[index] = { ...icon, x: newX, y: newY };
          updated = true;
        }
      }
    });

    if (updated) {
      desktopIconsCookie.value = currentIcons;
    }
  };

  return {
    isStartMenuOpen,
    isControlCenterOpen,
    isSearchOpen,
    taskbarPosition,
    icons,
    selectedIcons,
    toggleStartMenu,
    closeStartMenu,
    toggleControlCenter,
    closeControlCenter,
    toggleSearch,
    closeSearch,
    setTaskbarPosition,
    updateIconPosition,
    selectIcon,
    clearSelection,
    setSelection,
    resetIcons,
    ensureIconsInBounds,
    isTaskbarFloating,
    toggleTaskbarFloating
  };
});
