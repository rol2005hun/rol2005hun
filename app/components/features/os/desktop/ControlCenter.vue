<template>
  <div class="control-center glass-panel">
    <div class="user-section">
      <div class="avatar">
        <Icon name="ph:user-circle-fill" />
      </div>
      <div class="user-info">
        <h3>User</h3>
        <p>{{ $t('os.controlCenter.online') }}</p>
      </div>
      <button class="power-btn" @click="handleShutdown">
        <Icon name="ph:power-bold" />
      </button>
    </div>

    <div class="quick-grid">
      <div class="quick-tile" :class="{ active: wifiActive }" @click="wifiActive = !wifiActive">
        <div class="icon-circle">
          <Icon :name="wifiActive ? 'ph:wifi-high-bold' : 'ph:wifi-slash-bold'" />
        </div>
        <span>Wi-Fi</span>
      </div>

      <div class="quick-tile" :class="{ active: btActive }" @click="btActive = !btActive">
        <div class="icon-circle">
          <Icon name="ph:bluetooth-bold" />
        </div>
        <span>Bluetooth</span>
      </div>

      <div
        class="quick-tile"
        :class="{ active: airplaneMode }"
        @click="airplaneMode = !airplaneMode">
        <div class="icon-circle">
          <Icon name="ph:airplane-tilt-bold" />
        </div>
        <span>{{ $t('os.controlCenter.airplane') }}</span>
      </div>

      <div
        class="quick-tile"
        :class="{ active: themeStore.currentTheme === 'dark' }"
        @click="themeStore.toggleTheme()">
        <div class="icon-circle">
          <Icon :name="themeStore.currentTheme === 'dark' ? 'ph:moon-fill' : 'ph:sun-bold'" />
        </div>
        <span>
          {{ themeStore.currentTheme === 'dark' ? $t('os.themes.dark') : $t('os.themes.light') }}
        </span>
      </div>
    </div>

    <div class="sliders-section">
      <div class="slider-group">
        <Icon name="ph:speaker-high-fill" class="slider-icon" />
        <div class="slider-container">
          <input v-model="volume" type="range" min="0" max="100" class="cc-slider" />
          <div class="slider-progress" :style="{ width: volume + '%' }"></div>
        </div>
        <span class="val">{{ volume }}%</span>
      </div>

      <div class="slider-group">
        <Icon name="ph:sun-fill" class="slider-icon" />
        <div class="slider-container">
          <input v-model="brightness" type="range" min="0" max="100" class="cc-slider" />
          <div class="slider-progress" :style="{ width: brightness + '%' }"></div>
        </div>
        <span class="val">{{ brightness }}%</span>
      </div>
    </div>

    <div class="cc-footer">
      <div class="battery-info">
        <Icon :name="batteryIcon" />
        <span>{{ batteryLevel }}%</span>
      </div>
      <button class="settings-shortcut" @click="openSettings">
        <Icon name="ph:gear-six-fill" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useThemeStore } from '@/stores/features/os/useThemeStore';
import { useDesktopStore } from '@/stores/features/os/useDesktopStore';
import { useWindowStore } from '@/stores/features/os/useWindowStore';
import { useSystemStore } from '@/stores/features/os/useSystemStore';
import { useSystemInfo } from '@/composables/features/os/useSystemInfo';

const themeStore = useThemeStore();
const desktopStore = useDesktopStore();
const windowStore = useWindowStore();
const systemStore = useSystemStore();
const { batteryLevel: sysBattery, batteryCharging } = useSystemInfo();

const wifiActive = ref(true);
const btActive = ref(false);
const airplaneMode = ref(false);
const volume = ref(75);
const brightness = ref(85);

const batteryLevel = computed(() => {
  return sysBattery.value !== null ? Math.round(sysBattery.value * 100) : 100;
});

const batteryIcon = computed(() => {
  if (batteryCharging.value) return 'ph:battery-charging-fill';
  if (batteryLevel.value > 80) return 'ph:battery-full-fill';
  if (batteryLevel.value > 40) return 'ph:battery-high-fill';
  return 'ph:battery-medium-fill';
});

const openSettings = () => {
  windowStore.openWindow({
    id: 'settings',
    appId: 'settings',
    titleKey: 'os.apps.settings.name',
    width: 600,
    height: 500
  });
  desktopStore.closeControlCenter();
};

const handleShutdown = () => {
  systemStore.initiateShutdown();
};
</script>

<style scoped lang="scss">
.control-center {
  width: 340px;
  background: rgba(25, 25, 25, 0.8);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 20px;
  color: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  .avatar {
    font-size: 40px;
    color: var(--os-primary-color, #3b82f6);
  }

  .user-info {
    flex: 1;
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
    }
    p {
      margin: 2px 0 0;
      font-size: 12px;
      opacity: 0.6;
    }
  }

  .power-btn {
    background: rgba(255, 59, 48, 0.1);
    border: 1px solid rgba(255, 59, 48, 0.3);
    color: #ff3b30;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    font-size: 20px;

    &:hover {
      background: rgba(255, 59, 48, 0.2);
      border-color: #ff3b30;
      transform: scale(1.05);
    }
  }
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.quick-tile {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background:
      linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), var(--os-primary-color, #3b82f6);
    color: white;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    .icon-circle {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .icon-circle {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  }

  span {
    font-size: 13px;
    font-weight: 600;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  }
}

.sliders-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
}

.slider-group {
  display: flex;
  align-items: center;
  gap: 12px;

  .slider-icon {
    font-size: 18px;
    opacity: 0.7;
  }

  .slider-container {
    flex: 1;
    position: relative;
    height: 6px;
    display: flex;
    align-items: center;

    .cc-slider {
      width: 100%;
      height: 100%;
      appearance: none;
      -webkit-appearance: none;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      outline: none;
      cursor: pointer;
      z-index: 2;

      &::-webkit-slider-thumb {
        appearance: none;
        width: 14px;
        height: 14px;
        background: white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      }
    }

    .slider-progress {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: var(--os-primary-color, #3b82f6);
      border-radius: 3px;
      z-index: 1;
    }
  }

  .val {
    font-size: 12px;
    min-width: 30px;
    text-align: right;
    opacity: 0.6;
    font-variant-numeric: tabular-nums;
  }
}

.cc-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .battery-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    opacity: 0.8;
  }

  .settings-shortcut {
    background: transparent;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    opacity: 0.7;
    transition: transform 0.2s;
    &:hover {
      transform: rotate(45deg);
      opacity: 1;
    }
  }
}
</style>
