<template>
  <div class="mobile-environment">
    <div class="status-bar">
      <div class="time">{{ currentTime }}</div>
      <div class="notch"/>
      <div class="status-icons">
        <Icon name="ph:cell-signal-full-fill" size="14px" />
        <Icon name="ph:wifi-high-bold" size="14px" />
        <Icon name="ph:battery-full-fill" size="16px" />
      </div>
    </div>

    <div class="home-screen">
      <div class="app-grid">
        <div class="app-icon" @click="themeStore.toggleTheme">
          <div class="icon-box">
            <Icon :name="themeStore.currentTheme === 'dark' ? 'ph:moon-fill' : 'ph:sun-fill'" size="28px" />
          </div>
          <span class="app-label">{{ $t('os.mobile.themeIcon') }}</span>
        </div>
      </div>
    </div>

    <div class="navigation-bar">
      <div class="nav-pill"/>
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
.mobile-environment {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  color: #fff;
  z-index: 10;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%);
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

.home-screen {
  flex: 1;
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
  height: 34px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 8px;
  z-index: 20;
}

.nav-pill {
  width: 130px;
  height: 5px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 100px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

:root[data-theme='light'] {
  .icon-box {
    background: rgba(255, 255, 255, 0.6);
    color: #1a1a1a;
  }
}
</style>
