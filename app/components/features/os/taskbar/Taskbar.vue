<template>
  <div class="taskbar-container">
    <div class="taskbar-left">
      <button class="start-btn">
        <Icon name="ph:windows-logo-fill" size="24px" />
      </button>
      <div class="open-apps">
        <!-- Átmeneti app ikonok -->
      </div>
    </div>

    <div class="taskbar-right">
      <button class="sys-btn" @click="themeStore.toggleTheme">
        <Icon :name="themeStore.currentTheme === 'dark' ? 'ph:moon-fill' : 'ph:sun-fill'" size="20px" />
      </button>
      <div class="time-widget">
        {{ currentTime }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useThemeStore } from '@/stores/features/os/useThemeStore';

const themeStore = useThemeStore();
const currentTime = ref('');
let timer: ReturnType<typeof setInterval>;

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
  z-index: 9999;
}

.taskbar-left, .taskbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.start-btn, .sys-btn {
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
  transition: background 0.2s ease;

  &:hover {
    background: var(--os-hover, rgba(255, 255, 255, 0.1));
  }
}

.time-widget {
  color: var(--os-text, #ffffff);
  font-size: 13px;
  font-weight: 500;
  padding: 0 10px;
  height: 38px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: background 0.2s ease;
  user-select: none;

  &:hover {
    background: var(--os-hover, rgba(255, 255, 255, 0.1));
  }
}

/* Light Theme Variables overriding defaults */
:root[data-theme='light'] {
  --os-taskbar-bg: rgba(240, 240, 240, 0.85);
  --os-border-color: rgba(0, 0, 0, 0.1);
  --os-text: #1a1a1a;
  --os-hover: rgba(0, 0, 0, 0.05);
}
</style>
