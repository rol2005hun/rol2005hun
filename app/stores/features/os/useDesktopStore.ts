import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDesktopStore = defineStore('os-desktop', () => {
  const isStartMenuOpen = ref(false);

  const toggleStartMenu = () => {
    isStartMenuOpen.value = !isStartMenuOpen.value;
  };

  const closeStartMenu = () => {
    isStartMenuOpen.value = false;
  };

  return {
    isStartMenuOpen,
    toggleStartMenu,
    closeStartMenu,
  };
});
