<template>
  <div class="mobile-environment">
    <div class="status-bar" :class="{ 'app-active': activeAppId }">
      <div class="time">{{ currentTime }}</div>
      <div class="notch" />
      <div class="status-icons">
        <Icon name="ph:cell-signal-full-fill" size="14px" />
        <Icon name="ph:wifi-high-bold" size="14px" />
        <Icon name="ph:battery-full-fill" size="16px" />
      </div>
    </div>

    <transition name="app-scale">
      <div v-if="activeAppId" :key="'app-' + activeAppId" class="active-app-container">
        <component :is="appComponents[activeAppId]" />
      </div>

      <div v-else key="home" class="home-screen">
        <div class="app-grid">
          <div
            v-for="app in mobileVisibleApps"
            :key="app.id"
            class="app-icon"
            @click="openApp(app.id)">
            <div class="icon-box">
              <Icon :name="app.icon" size="28px" />
            </div>
            <span class="app-label">{{ $t(app.nameKey) }}</span>
          </div>
        </div>
      </div>
    </transition>

    <div class="navigation-bar" :class="{ active: activeAppId }" @click="closeApp">
      <div class="nav-pill" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent, computed } from 'vue';
import { useAppRegistry } from '@/stores/features/os/useAppRegistry';

const appRegistry = useAppRegistry();

const mobileVisibleApps = computed(() => {
  return appRegistry.installedApps.filter((app) => {
    if (app.showOnDesktop === false) return false;
    if (Array.isArray(app.showOnDesktop) && !app.showOnDesktop.includes('mobile')) return false;
    return true;
  });
});

const appComponents: Record<string, any> = {
  settings: defineAsyncComponent(
    () => import('@/components/features/os/apps/settings/SettingsApp.vue')
  ),
  browser: defineAsyncComponent(
    () => import('@/components/features/os/apps/browser/BrowserApp.vue')
  ),
  terminal: defineAsyncComponent(
    () => import('@/components/features/os/apps/terminal/TerminalApp.vue')
  ),
  about: defineAsyncComponent(() => import('@/components/features/os/apps/about/AboutApp.vue')),
  projects: defineAsyncComponent(
    () => import('@/components/features/os/apps/projects/ProjectsApp.vue')
  ),
  music: defineAsyncComponent(() => import('@/components/features/os/apps/music/MusicApp.vue'))
};

const currentTime = ref('');
const activeAppId = ref<string | null>(null);
let timer: ReturnType<typeof setInterval>;

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const openApp = (appId: string) => {
  activeAppId.value = appId;
};

const closeApp = () => {
  activeAppId.value = null;
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped lang="scss">
.mobile-environment {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  color: #fff;
  z-index: 10;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.status-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  z-index: 50;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 100%);
  pointer-events: none;
  box-sizing: border-box;

  &.app-active {
    background: var(--os-window-bg);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
}

.notch {
  width: 120px;
  height: 25px;
  background-color: #000;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.status-icons {
  display: flex;
  align-items: center;
  gap: 6px;
}

.app-scale-enter-active,
.app-scale-leave-active {
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-origin: center center;
}
.app-scale-enter-from {
  opacity: 0;
  transform: scale(0.6);
}
.app-scale-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

.active-app-container {
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  bottom: 34px;
  width: 100%;
  background: var(--os-window-bg);
  overflow: hidden;
  box-sizing: border-box;
  z-index: 15;
}

.home-screen {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 84px 20px 40px 20px;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    display: none;
  }
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px 10px;
  justify-items: center;
}

.app-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &:active .icon-box {
    filter: brightness(0.7);
    transform: scale(0.95);
  }
}

.icon-box {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.app-label {
  font-size: 12px;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.navigation-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 34px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 8px;
  z-index: 9999;
  cursor: pointer;
  pointer-events: auto;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0%, transparent 100%);
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:hover .nav-pill {
    background: rgba(255, 255, 255, 1);
    transform: scaleY(1.2);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  &.active {
    background: var(--os-window-bg);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  .icon-box {
    background: rgba(255, 255, 255, 0.5);
    color: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.05),
      inset 0 2px 4px rgba(255, 255, 255, 0.8);
  }

  .app-label {
    text-shadow: none;
    color: #1a1a1a;
    font-weight: 600;
  }
}
</style>
