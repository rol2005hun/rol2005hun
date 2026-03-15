import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface OSWindow {
  id: string;
  title: string;
  component: any;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export const useWindowStore = defineStore('os-window', () => {
  const windows = ref<OSWindow[]>([]);
  const topZIndex = ref(100);

  const openWindow = (windowInfo: Omit<OSWindow, 'isOpen' | 'isMinimized' | 'isMaximized' | 'zIndex'>) => {
    const existing = windows.value.find(w => w.id === windowInfo.id);
    if (existing) {
      if (existing.isMinimized) existing.isMinimized = false;
      focusWindow(existing.id);
      return;
    }

    topZIndex.value++;
    windows.value.push({
      ...windowInfo,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: topZIndex.value,
    });
  };

  const closeWindow = (id: string) => {
    windows.value = windows.value.filter(w => w.id !== id);
  };

  const toggleMinimize = (id: string) => {
    const win = windows.value.find(w => w.id === id);
    if (win) {
      win.isMinimized = !win.isMinimized;
      if (!win.isMinimized) focusWindow(id);
    }
  };

  const toggleMaximize = (id: string) => {
    const win = windows.value.find(w => w.id === id);
    if (win) {
      win.isMaximized = !win.isMaximized;
      if (win.isMaximized) focusWindow(id);
    }
  };

  const focusWindow = (id: string) => {
    const win = windows.value.find(w => w.id === id);
    if (win && win.zIndex < topZIndex.value) {
      topZIndex.value++;
      win.zIndex = topZIndex.value;
    }
  };

  return {
    windows,
    openWindow,
    closeWindow,
    toggleMinimize,
    toggleMaximize,
    focusWindow,
  };
});
