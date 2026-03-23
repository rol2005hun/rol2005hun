<template>
  <div v-if="systemStore.activeLegacyOS" class="legacy-os-viewer">
    <div class="legacy-overlay-hint" :class="{ 'fade-out': hintFaded }">
      {{ $t('os.apps.about.legacy.exitHint') }}
    </div>
    <button
      class="legacy-close-btn"
      @click="systemStore.exitLegacyOS()"
      :title="$t('os.apps.about.legacy.exitHint')">
      <Icon name="ph:x-bold" size="24" />
    </button>
    <iframe
      :src="systemStore.activeLegacyOS"
      frameborder="0"
      class="legacy-iframe"
      title="legacy-os"
      allow="fullscreen"></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useSystemStore } from '@/stores/features/os/useSystemStore';

const systemStore = useSystemStore();
const hintFaded = ref(false);
let hintTimeout: ReturnType<typeof setTimeout>;

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && systemStore.activeLegacyOS) {
    systemStore.exitLegacyOS();
  }
};

watch(
  () => systemStore.activeLegacyOS,
  (newVal) => {
    if (newVal) {
      hintFaded.value = false;
      clearTimeout(hintTimeout);
      hintTimeout = setTimeout(() => {
        hintFaded.value = true;
      }, 4000);
    }
  }
);

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  clearTimeout(hintTimeout);
});
</script>

<style scoped lang="scss">
.legacy-os-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999999;
  background-color: #000;
  animation: boot-up 0.5s ease-out forwards;
}

.legacy-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #111;
}

.legacy-overlay-hint {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  z-index: 10;
  transition: opacity 1s ease-in-out;
}

.fade-out {
  opacity: 0;
}

.legacy-close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(220, 38, 38, 0.8);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

@keyframes boot-up {
  0% {
    transform: scale(0.9);
    opacity: 0;
    filter: blur(10px);
  }
  100% {
    transform: scale(1);
    opacity: 1;
    filter: blur(0);
  }
}
</style>
