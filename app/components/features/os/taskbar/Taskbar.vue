<template>
  <div class="taskbar-container" @click.self="desktopStore.closeStartMenu()">
    <div class="taskbar-left">
      <button
        class="start-btn"
        :class="{ active: desktopStore.isStartMenuOpen }"
        @click="desktopStore.toggleStartMenu()">
        <Icon name="ph:circles-four-fill" size="24px" />
      </button>

      <div class="open-apps">
        <button
          v-for="win in windowStore.windows"
          :key="win.id"
          class="app-btn-taskbar"
          :class="{ active: win.zIndex === topZIndex && !win.isMinimized }"
          @click="toggleWindow(win.id)">
          <AppIcon :app-id="win.appId" size="20px" />
        </button>
      </div>
    </div>

    <div class="taskbar-right">
      <div class="sys-tray">
        <Icon :name="wifiIcon" size="16px" :title="wifiTitle" />
        <Icon name="ph:speaker-high-fill" size="16px" />
        <Icon
          v-if="batteryLevel !== null"
          :name="batteryIcon"
          size="16px"
          :title="`${Math.round(batteryLevel * 100)}%`" />
      </div>
      <div class="time-widget">
        <div class="time-text">{{ currentTime }}</div>
        <div class="date-text">{{ currentDate }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useDesktopStore } from '@/stores/features/os/useDesktopStore';
import { useWindowStore } from '@/stores/features/os/useWindowStore';
import { useSystemInfo } from '@/composables/features/os/useSystemInfo';
import AppIcon from '@/components/features/os/shared/AppIcon.vue';

const desktopStore = useDesktopStore();
const windowStore = useWindowStore();

const { batteryLevel, batteryCharging, online, connectionType } = useSystemInfo();

const wifiIcon = computed(() => {
  if (!online.value) return 'ph:wifi-slash-bold';
  if (connectionType.value === 'cellular') return 'ph:cell-signal-full-bold';
  return 'ph:wifi-high-bold';
});

const wifiTitle = computed(() => {
  if (!online.value) return 'Offline';
  return connectionType.value === 'cellular' ? 'Cellular' : 'Wi-Fi';
});

const batteryIcon = computed(() => {
  if (batteryLevel.value === null) return 'ph:battery-full-fill';
  if (batteryCharging.value) return 'ph:battery-charging-fill';

  const level = batteryLevel.value * 100;
  if (level > 80) return 'ph:battery-full-fill';
  if (level > 40) return 'ph:battery-high-fill';
  if (level > 10) return 'ph:battery-medium-fill';
  return 'ph:battery-low-fill';
});

const currentTime = ref('');
const currentDate = ref('');
let timer: ReturnType<typeof setInterval>;

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  currentDate.value = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

const topZIndex = computed(() => {
  return Math.max(0, ...windowStore.windows.map((w) => w.zIndex));
});

const toggleWindow = (id: string) => {
  const win = windowStore.windows.find((w) => w.id === id);
  if (win) {
    if (win.isMinimized) {
      windowStore.toggleMinimize(id);
    } else if (win.zIndex === topZIndex.value) {
      windowStore.toggleMinimize(id);
    } else {
      windowStore.focusWindow(id);
    }
  }
};
</script>

<style scoped lang="scss">
.taskbar-container {
  height: 48px;
  width: 100%;
  background: var(--os-taskbar-bg, rgba(20, 20, 20, 0.85));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  border-top: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  z-index: 10000;
}

.taskbar-left,
.taskbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.start-btn,
.app-btn-taskbar {
  background: transparent;
  border: none;
  color: var(--os-text, #ffffff);
  height: 38px;
  width: 38px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--os-hover, rgba(255, 255, 255, 0.1));
  }

  &.active {
    background: var(--os-active, rgba(255, 255, 255, 0.2));
    box-shadow: inset 0 -2px 0 var(--os-primary-color, #fff);
  }
}

.open-apps {
  display: flex;
  gap: 4px;
}

.sys-tray {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 10px;
  color: var(--os-text, #fff);
}

.time-widget {
  color: var(--os-text, #ffffff);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding: 0 10px;
  height: 38px;
  border-radius: 6px;
  cursor: default;
  user-select: none;
  line-height: 1.2;

  &:hover {
    background: var(--os-hover, rgba(255, 255, 255, 0.1));
  }

  .time-text {
    font-size: 13px;
    font-weight: 500;
  }
  .date-text {
    font-size: 11px;
    opacity: 0.8;
  }
}
</style>
