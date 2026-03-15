<template>
  <div class="desktop-surface">
    <div
      class="wallpaper"
      :style="{ backgroundImage: 'url(' + themeStore.currentWallpaperUrl + ')' }"
    />

    <div v-if="!isMobile" class="windows-layer"/>

    <Desktop v-if="!isMobile" />
    <MobileOS v-else />
  </div>
</template>

<script setup lang="ts">
import Desktop from '@/components/features/os/desktop/Desktop.vue';
import MobileOS from '@/components/features/os/mobile/MobileOS.vue';
import { useDevice } from '@/composables/features/os/useDevice';
import { useThemeStore } from '@/stores/features/os/useThemeStore';

const themeStore = useThemeStore();
const { isMobile } = useDevice();
</script>

<style scoped lang="scss">
.desktop-surface {
  width: 100%;
  height: 100%;
  position: relative;

  .wallpaper {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 1;
    transition: background-image 0.5s ease-in-out;
  }

  .windows-layer {
    position: relative;
    z-index: 2;
    width: 100%;
    height: calc(100% - 48px);
  }
}
</style>
