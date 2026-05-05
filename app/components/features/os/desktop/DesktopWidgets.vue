<template>
  <div class="desktop-widgets visible">
    <div
      v-if="themeStore.activeWidgets.clock"
      class="widget clock-widget"
      :style="getWidgetStyle('clock')"
      @mousedown="startDrag($event, 'clock')">
      <div class="time">{{ currentTime }}</div>
      <div class="date">{{ currentDate }}</div>
    </div>

    <div
      v-if="themeStore.activeWidgets.stats"
      class="widget stats-widget glass-card"
      :style="getWidgetStyle('stats')"
      @mousedown="startDrag($event, 'stats')">
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

    <div
      v-if="themeStore.activeWidgets.welcome"
      class="widget welcome-widget glass-card"
      :style="getWidgetStyle('welcome')"
      @mousedown="startDrag($event, 'welcome')">
      <Icon name="ph:sparkle-fill" class="sparkle" />
      <div class="text">
        <h3>{{ greeting }}</h3>
        <p>{{ $t('os.widgets.welcomeMsg') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, type CSSProperties } from 'vue';
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
  cpuLoad.value = Math.floor(Math.random() * 15) + 5;
  ramUsage.value = 42 + Math.floor(Math.random() * 5);
};

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return t('os.widgets.goodMorning');
  if (hour < 18) return t('os.widgets.goodAfternoon');
  return t('os.widgets.goodEvening');
});

const isDragging = ref(false);
const activeWidget = ref<string | null>(null);
const offset = { x: 0, y: 0 };

const startDrag = (e: MouseEvent, id: string) => {
  const pos = themeStore.widgetPositions[id];
  if (!pos) return;

  isDragging.value = true;
  activeWidget.value = id;

  const screenX = pos.x < 0 ? window.innerWidth + pos.x : pos.x;
  const screenY = pos.y;

  offset.x = e.clientX - screenX;
  offset.y = e.clientY - screenY;

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || !activeWidget.value) return;

  const currentPos = themeStore.widgetPositions[activeWidget.value];
  if (!currentPos) return;

  const x = e.clientX - offset.x;
  const y = e.clientY - offset.y;

  const isRightAligned = currentPos.x < 0;
  const storedX = isRightAligned ? x - window.innerWidth : x;

  themeStore.updateWidgetPosition(activeWidget.value, storedX, y);
};

const stopDrag = () => {
  isDragging.value = false;
  activeWidget.value = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

const getWidgetStyle = (id: string): CSSProperties => {
  const pos = themeStore.widgetPositions[id];
  if (!pos) return {};

  const style: CSSProperties = {
    top: `${pos.y}px`,
    cursor: isDragging.value ? 'grabbing' : 'grab'
  };

  if (pos.x < 0) {
    style.right = `${Math.abs(pos.x)}px`;
  } else {
    style.left = `${pos.x}px`;
  }

  if (activeWidget.value === id) {
    style.zIndex = 100;
    style.transition = 'none';
    style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
  }

  return style;
};

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
  pointer-events: none;
  opacity: 0;
  transition: opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 5;

  &.visible {
    opacity: 1;
    .widget {
      pointer-events: auto;
    }
  }
}

.widget {
  position: absolute;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease,
    box-shadow 0.3s ease;
  user-select: none;
}

.clock-widget {
  color: white;
  text-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
  width: fit-content;

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
    .time {
      font-size: 80px;
    }
  }
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 320px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
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
