<template>
  <div class="os-root">
    <LockScreen v-if="!authStore.isUnlocked" class="lock-screen-overlay" />

    <div
      v-show="authStore.isUnlocked"
      class="desktop-container"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/composables/features/auth/useAuthStore';
import LockScreen from '~/components/features/auth/LockScreen.vue';

const authStore = useAuthStore();
</script>

<style scoped lang="scss">
.os-root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
  position: relative;
}

.lock-screen-overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
}

.desktop-container {
  width: 100%;
  height: 100%;
}
</style>
