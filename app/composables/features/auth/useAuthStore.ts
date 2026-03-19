import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useCookie } from '#imports';

export const useAuthStore = defineStore('auth', () => {
  const isUnlocked = ref(false);
  const rootToken = useCookie('root_token', { maxAge: 86400, secure: true, sameSite: 'strict' });
  const user = ref<{ username: string; role: string } | null>(
    rootToken.value ? { username: 'root', role: 'admin' } : null
  );

  const unlockOS = () => {
    isUnlocked.value = true;
  };

  const lockOS = () => {
    isUnlocked.value = false;
  };

  const loginRoot = (token: string) => {
    rootToken.value = token;
    user.value = { username: 'root', role: 'admin' };
  };

  const logoutRoot = () => {
    rootToken.value = null;
    user.value = null;
  };

  const checkRootSession = async () => {
    if (!rootToken.value) return false;
    try {
      const res = await $fetch('/api/terminal/verify', {
        method: 'POST',
        body: { token: rootToken.value }
      });
      if (!res.valid) {
        logoutRoot();
        return false;
      }
      return true;
    } catch {
      logoutRoot();
      return false;
    }
  };

  return {
    isUnlocked,
    unlockOS,
    lockOS,
    rootToken,
    user,
    loginRoot,
    logoutRoot,
    checkRootSession
  };
});
