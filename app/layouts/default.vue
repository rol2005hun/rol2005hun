<template>
  <div class="os-root">
    <SystemSetup v-if="!isInstalled" @setup-complete="handleSetupComplete" />

    <template v-else>
      <LockScreen v-if="!authStore.isUnlocked" class="lock-screen-overlay" />

      <div v-show="authStore.isUnlocked" class="desktop-container">
        <slot />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCookie } from '#imports';
import SystemSetup from '@/components/features/setup/SystemSetup.vue';
import LockScreen from '@/components/features/auth/LockScreen.vue';
import { useAuthStore } from '@/composables/features/auth/useAuthStore';

const authStore = useAuthStore();
const licenseCookie = useCookie('ranzakos_license');
const isInstalled = ref(licenseCookie.value === 'valid');

const handleSetupComplete = () => {
  isInstalled.value = true;
};
</script>

<style scoped lang="scss">
.os-root {
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  background-color: #000;
  position: relative;
}

.lock-screen-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

.desktop-container {
  width: 100%;
  height: 100%;
}
</style>
