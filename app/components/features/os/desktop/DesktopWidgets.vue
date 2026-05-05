<template>
  <div class="desktop-widgets" :class="{ visible: themeStore.showWidgets }">
    <div class="widget-container left">
      <div class="clock-widget">
        <div class="time">{{ currentTime }}</div>
        <div class="date">{{ currentDate }}</div>
      </div>
    </div>

    <div class="widget-container right">
      <div class="stats-widget glass-card">
        <div class="stat-item">
          <div class="label">
            <Icon name="ph:cpu-fill" />
            <span>CPU</span>
          </div>
          <div class="bar-container">
            <div class="bar" :style="{ width: cpuLoad + '%' }"></div>
          </div>
          <div class="value">{{ cpuLoad }}%</div>
        </div>
        <div class="stat-item">
          <div class="label">
            <Icon name="ph:memory-fill" />
            <span>RAM</span>
          </div>
          <div class="bar-container">
            <div class="bar" :style="{ width: ramUsage + '%' }"></div>
          </div>
          <div class="value">{{ ramUsage }}%</div>
        </div>
      </div>

      <div class="welcome-widget glass-card">
        <Icon name="ph:sparkle-fill" class="sparkle" />
        <div class="text">
          <h3>{{ greeting }}</h3>
          <p>{{ $t('os.widgets.welcomeMsg') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useThemeStore } from '@/stores/features/os/useThemeStore';
import { useI18n } from 'vue-i18n';

const themeStore = useThemeStore();
const { t, locale } = useI18n();

const currentTime = ref('');
const currentDate = ref('');
const cpuLoad = ref(0);
const ramUsage = ref(0);

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString(locale.value, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  currentDate.value = now.toLocaleDateString(locale.value, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
};

const updateStats = () => {
  // Simulated stats
  cpuLoad.value = Math.floor(Math.random() * 15) + 5;
  ramUsage.value = 42 + Math.floor(Math.random() * 5);
};

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return t('os.widgets.goodMorning');
  if (hour < 18) return t('os.widgets.goodAfternoon');
  return t('os.widgets.goodEvening');
});

let timeInterval: ReturnType<typeof setInterval>;
let statsInterval: ReturnType<typeof setInterval>;

onMounted(() => {
  updateTime();
  updateStats();
  timeInterval = setInterval(updateTime, 1000);
  statsInterval = setInterval(updateStats, 5000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
  clearInterval(statsInterval);
});
</script>

<style scoped lang="scss">
.desktop-widgets {
  position: absolute;
  inset: 0;
  padding: 60px 80px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  opacity: 0;
  transform: scale(1.05);
  transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 5;

  &.visible {
    opacity: 1;
    transform: scale(1);
  }

  @media (max-width: 1024px) {
    padding: 40px;
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }
}

.widget-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 320px;

  &.left {
    justify-content: center;
  }
}

.clock-widget {
  color: white;
  text-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
  
  .time {
    font-size: 120px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -4px;
    font-variant-numeric: tabular-nums;
  }

  .date {
    font-size: 24px;
    font-weight: 500;
    opacity: 0.9;
    margin-top: 10px;
    text-transform: capitalize;
  }

  @media (max-width: 1024px) {
    text-align: center;
    .time { font-size: 80px; }
  }
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 24px;
  pointer-events: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-5px);
  }
}

.stats-widget {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      opacity: 0.8;
      color: white;
    }

    .bar-container {
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;

      .bar {
        height: 100%;
        background: var(--os-primary-color, #fff);
        border-radius: 3px;
        transition: width 1s ease;
      }
    }

    .value {
      font-size: 12px;
      text-align: right;
      font-weight: 700;
      opacity: 0.6;
      color: white;
    }
  }
}

.welcome-widget {
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;

  .sparkle {
    font-size: 32px;
    color: var(--os-primary-color, #fff);
    filter: drop-shadow(0 0 10px var(--os-primary-color));
  }

  h3 {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
  }

  p {
    font-size: 13px;
    margin: 4px 0 0;
    opacity: 0.7;
  }
}
</style>
