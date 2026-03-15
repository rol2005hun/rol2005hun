import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isUnlocked = ref(false);

  const unlockOS = () => {
    isUnlocked.value = true;
  };

  const lockOS = () => {
    isUnlocked.value = false;
  };

  return {
    isUnlocked,
    unlockOS,
    lockOS
  };
});
