<template>
  <div class="mobile-environment">
    <div class="status-bar">
      <div class="time">{{ currentTime }}</div>
      <div class="notch"></div>
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
            v-for="app in appRegistry.installedApps"
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
      <div class="nav-pill"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAppRegistry } from '@/stores/features/os/useAppRegistry';

import BrowserApp from '@/components/features/os/apps/browser/BrowserApp.vue';
import TerminalApp from '@/components/features/os/apps/terminal/TerminalApp.vue';
import AboutApp from '@/components/features/os/apps/about/AboutApp.vue';
import ProjectsApp from '@/components/features/os/apps/projects/ProjectsApp.vue';
import SettingsApp from '@/components/features/os/apps/settings/SettingsApp.vue';

const appComponents: Record<string, any> = {
  settings: SettingsApp,
  browser: BrowserApp,
  terminal: TerminalApp,
  about: AboutApp,
  projects: ProjectsApp
};

const appRegistry = useAppRegistry();

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
  height: 44px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  z-index: 20;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 100%);
}

.notch {
  width: 120px;
  height: 28px;
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
  top: 44px; /* Fix pozíció, elkerüli a layout ugrást befejezéskor */
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: var(--os-bg, #000);
  overflow: hidden;
  z-index: 15;
}

.home-screen {
  position: absolute;
  top: 44px; /* Ugyanúgy fix pozíció */
  left: 0;
  right: 0;
  bottom: 0;
  padding: 40px 20px;
  overflow-y: auto;

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

  &:hover .nav-pill {
    background: rgba(255, 255, 255, 1);
    transform: scaleY(1.2);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  &.active {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, transparent 100%);
  }
}

.nav-pill {
  width: 130px;
  height: 5px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 100px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

:root[data-theme='light'] {
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
