import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSystemStore = defineStore('system', () => {
  const isShuttingDown = ref(false);
  const showShutdownModal = ref(false);
  const activeLegacyOS = ref<string | null>(null);

  const initiateShutdown = () => {
    showShutdownModal.value = true;
  };

  const cancelShutdown = () => {
    showShutdownModal.value = false;
  };

  const confirmShutdown = () => {
    showShutdownModal.value = false;
    isShuttingDown.value = true;

    window.close();

    setTimeout(() => {
      window.location.href = 'about:blank';
    }, 200);
  };

  const bootLegacyOS = (url: string) => {
    activeLegacyOS.value = url;
  };

  const exitLegacyOS = () => {
    activeLegacyOS.value = null;
  };

  return {
    isShuttingDown,
    showShutdownModal,
    activeLegacyOS,
    initiateShutdown,
    cancelShutdown,
    confirmShutdown,
    bootLegacyOS,
    exitLegacyOS
  };
});
