<template>
  <div class="os-root">
    <Transition name="fade">
      <SystemSetup
        v-if="!isInstalled"
        class="setup-overlay"
        @setup-complete="handleSetupComplete" />
    </Transition>

    <div v-show="isInstalled" class="os-content-wrapper">
      <Transition name="fade">
        <LockScreen v-if="!authStore.isUnlocked" class="lock-screen-overlay" />
      </Transition>

      <Transition name="fade">
        <ShutdownModal v-if="systemStore.showShutdownModal" />
      </Transition>

      <LegacyOSViewer />

      <div class="desktop-container" :class="{ 'is-locked': !authStore.isUnlocked }">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useCookie } from '#imports';
import SystemSetup from '@/components/features/setup/SystemSetup.vue';
import LockScreen from '@/components/features/auth/LockScreen.vue';
import LegacyOSViewer from '@/components/features/os/desktop/LegacyOSViewer.vue';
import ShutdownModal from '@/components/features/os/desktop/ShutdownModal.vue';
import { useAuthStore } from '@/composables/features/auth/useAuthStore';
import { useSystemStore } from '@/stores/features/os/useSystemStore';

const authStore = useAuthStore();
const systemStore = useSystemStore();
const licenseCookie = useCookie('ranzakos_license');
const isInstalled = ref(licenseCookie.value === 'valid');

const handleSetupComplete = () => {
  isInstalled.value = true;
};

const preventRefresh = (e: KeyboardEvent) => {
  if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.key === 'R')) {
    e.preventDefault();
    systemStore.initiateShutdown();
  }
};

const preventZoom = (e: KeyboardEvent | WheelEvent) => {
  if (e.ctrlKey) {
    if (e.type === 'wheel') {
      e.preventDefault();
    } else if (e.type === 'keydown') {
      const ke = e as KeyboardEvent;
      if (
        ke.key === '+' ||
        ke.key === '-' ||
        ke.key === '=' ||
        ke.key === 'NumpadAdd' ||
        ke.key === 'NumpadSubtract'
      ) {
        e.preventDefault();
      }
    }
  }
};

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (systemStore.isShuttingDown) {
    return;
  }

  e.preventDefault();
};

onMounted(() => {
  window.addEventListener('keydown', preventRefresh);
  window.addEventListener('keydown', preventZoom as any, { passive: false });
  window.addEventListener('wheel', preventZoom as any, { passive: false });
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', preventRefresh);
  window.removeEventListener('keydown', preventZoom as any);
  window.removeEventListener('wheel', preventZoom as any);
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
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

  &.is-locked {
    pointer-events: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.setup-overlay {
  position: absolute;
  inset: 0;
  z-index: 10000;
}

.os-content-wrapper {
  width: 100%;
  height: 100%;
}
</style>
