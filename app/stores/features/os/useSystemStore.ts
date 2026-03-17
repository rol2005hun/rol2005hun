import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSystemStore = defineStore('os-system', () => {
  const showShutdownModal = ref(false);
  const isShuttingDown = ref(false);

  const requestShutdown = () => {
    showShutdownModal.value = true;
  };

  const cancelShutdown = () => {
    showShutdownModal.value = false;
  };

  const confirmShutdown = () => {
    isShuttingDown.value = true;
    showShutdownModal.value = false;
    window.close();

    setTimeout(() => {
       document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#fff;font-family:sans-serif;">OS leállítva. Bezárhatod ezt az ablakot.</div>';
    }, 500);
  };

  return {
    showShutdownModal,
    isShuttingDown,
    requestShutdown,
    cancelShutdown,
    confirmShutdown
  };
});
