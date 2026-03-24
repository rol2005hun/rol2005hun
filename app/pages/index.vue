<template>
  <div class="os-root">
    <div
      class="wallpaper"
      :style="{ backgroundImage: 'url(' + themeStore.currentWallpaperUrl + ')' }" />

    <template v-if="authStore.isUnlocked">
      <Desktop v-if="!isMobile" />
      <MobileOS v-else />
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useDevice } from '@/composables/features/os/useDevice';
import { useThemeStore } from '@/stores/features/os/useThemeStore';
import { useAuthStore } from '@/composables/features/auth/useAuthStore';

// Késleltetett betöltés, hogy a Desktop, MobileOS és a velük járó Store-ok
// ne töltődjenek be előre a memóriába a LockScreen (Auth) alatt.
const Desktop = defineAsyncComponent(() => import('@/components/features/os/desktop/Desktop.vue'));
const MobileOS = defineAsyncComponent(() => import('@/components/features/os/mobile/MobileOS.vue'));

const themeStore = useThemeStore();
const authStore = useAuthStore();
const { isMobile } = useDevice();
</script>

<style scoped lang="scss">
.os-root {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .wallpaper {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 1;
    transition: background-image 0.5s ease-in-out;
  }
}
</style>
