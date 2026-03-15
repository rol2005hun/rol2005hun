<template>
  <div class="desktop-surface">
    <div class="wallpaper"/>
    <div class="windows-layer">
      <!-- Windows will be rendered here -->
    </div>
    <Desktop />
  </div>
</template>

<script setup lang="ts">
import Desktop from '@/components/features/os/desktop/Desktop.vue';
</script>

<style scoped lang="scss">
.desktop-surface {
  width: 100%;
  height: 100%;
  position: relative;

  .wallpaper {
    position: absolute;
    inset: 0;
    background: url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070") no-repeat center center;
    background-size: cover;
    z-index: 1;
  }

  .windows-layer {
    position: relative;
    z-index: 2;
    width: 100%;
    height: calc(100% - 48px);
  }
}
</style>
