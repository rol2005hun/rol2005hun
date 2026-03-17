<template>
  <div class="os-app-icon" :style="{ width: size, height: size }">
    <img v-if="app?.logo" :src="app.logo" :alt="app.id" class="app-image-logo" >
    <Icon v-else :name="app?.icon || defaultIcon" :size="size" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppRegistry } from '@/stores/features/os/useAppRegistry';

const props = defineProps<{
  appId: string;
  size?: string;
}>();

const registry = useAppRegistry();

const app = computed(() => registry.getAppById(props.appId));
const defaultIcon = 'ph:app-window';
</script>

<style scoped lang="scss">
.os-app-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  .app-image-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: inherit;
  }
}
</style>
