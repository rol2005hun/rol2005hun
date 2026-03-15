<template>
  <div class="desktop-environment">
    <!-- OS Windows layer could go here -->

    <!-- Taskbar at bottom -->
    <Taskbar class="fixed-bottom" />
  </div>
</template>

<script setup lang="ts">
import Taskbar from '@/components/features/os/taskbar/Taskbar.vue';
</script>

<style scoped lang="scss">
.desktop-environment {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
}

.fixed-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
