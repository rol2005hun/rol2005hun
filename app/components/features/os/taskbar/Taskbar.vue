<template>
  <div
    class="taskbar-container"
    :class="[
      desktopStore.taskbarPosition,
      { active: desktopStore.isControlCenterOpen, floating: desktopStore.isTaskbarFloating }
    ]"
    @click.self="desktopStore.closeStartMenu()">
    <div class="taskbar-left">
      <button
        class="start-btn"
        :class="{ active: desktopStore.isStartMenuOpen }"
        @click.stop="desktopStore.toggleStartMenu()">
        <Icon name="ph:dots-nine-bold" size="24px" />
      </button>

      <div class="open-apps">
        <button
          v-for="win in windowStore.windows"
          :key="win.id"
          class="app-btn-taskbar"
          :class="{ active: win.zIndex === topZIndex && !win.isMinimized }"
          @click.stop="toggleWindow(win.id)">
          <AppIcon :app-id="win.appId" size="24px" />
        </button>
      </div>
    </div>

    <div class="taskbar-spacer"></div>

    <div class="taskbar-right">
      <div
        class="tray-button"
        :class="{ active: desktopStore.isControlCenterOpen }"
        @click="desktopStore.toggleControlCenter()">
        <div class="sys-tray">
          <Icon :name="wifiIcon" size="16px" :title="wifiTitle" />
          <Icon name="ph:speaker-high-fill" size="16px" />
          <Icon
            v-if="batteryLevel !== null"
            :name="batteryIcon"
            size="16px"
            :title="`${Math.round(batteryLevel * 100)}%`" />
        </div>
      </div>

      <div class="time-button" @click="openCalendar">
        <div class="time-widget">
          <div class="time-text">{{ currentTime }}</div>
          <div class="date-text">{{ currentDate }}</div>
        </div>
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

const openCalendar = () => {
  windowStore.openWindow({
    id: 'calendar',
    appId: 'calendar',
    titleKey: 'os.apps.calendar.name',
    width: 400,
    height: 450
  });
};
</script>

<style scoped lang="scss">
.taskbar-container {
  background: var(--os-taskbar-bg, rgba(20, 20, 20, 0.85));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  position: absolute;
  z-index: 10000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.bottom,
  &.top {
    height: 48px;
    width: 100%;
    left: 0;
    border-radius: 0;
    border: none;
    padding: 0 10px;

    &.floating {
      width: auto;
      min-width: 400px;
      max-width: 90vw;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 20px;
      padding: 0 12px;
      border: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
  }

  &.bottom {
    bottom: 0;
    border-top: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
    &.floating {
      bottom: 12px;
      border-top: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
    }
  }

  &.top {
    top: 0;
    border-bottom: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
    &.floating {
      top: 12px;
      border-bottom: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
    }
  }

  &.left,
  &.right {
    flex-direction: column;
    width: 72px;
    height: 100%;
    top: 0;
    border-radius: 0;
    padding: 10px 0;

    &.floating {
      height: auto;
      min-height: 200px;
      max-height: calc(100% - 40px);
      top: 50%;
      transform: translateY(-50%);
      padding: 12px 0;
      border-radius: 24px;
      border: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    }
  }

  &.left {
    left: 0;
    border-right: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
    &.floating {
      left: 12px;
      border-right: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
    }
  }

  &.right {
    right: 0;
    border-left: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
    &.floating {
      right: 12px;
      border-left: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
    }
  }
}

.taskbar-left,
.taskbar-right {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 100%;

  .left &,
  .right & {
    flex-direction: column;
    height: auto;
    width: 100%;
    gap: 6px;
  }
}

.taskbar-left {
  .left &,
  .right & {
    flex-direction: column;
  }
}

.taskbar-right {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 100%;

  .left &,
  .right & {
    flex-direction: column;
    height: auto;
    width: 100%;
    gap: 8px;
  }
}

.tray-button,
.time-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--os-hover, rgba(255, 255, 255, 0.1));
  }

  &.active {
    background: var(--os-active, rgba(255, 255, 255, 0.15));
  }

  .left &,
  .right & {
    width: 56px;
    height: auto;
    padding: 8px 0;
  }
}

.taskbar-spacer {
  flex: 1;
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

  .left &,
  .right & {
    flex-direction: column;
  }
}

.sys-tray {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 6px;
  color: var(--os-text, #fff);

  .left &,
  .right & {
    flex-direction: column;
    padding: 6px 0;
  }
}

.time-widget {
  color: var(--os-text, #ffffff);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding: 0 4px;
  border-radius: 6px;
  cursor: default;
  user-select: none;
  line-height: 1.2;

  .left &,
  .right & {
    align-items: center;
    padding: 4px 0;
    text-align: center;
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
