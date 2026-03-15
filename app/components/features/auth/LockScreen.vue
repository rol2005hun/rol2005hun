<template>
  <div class="lock-screen-container">
    <div class="clock-widget">
      <h1 class="time">{{ currentTime }}</h1>
      <p class="date">{{ currentDate }}</p>
    </div>

    <div class="auth-wrapper">
      <div class="user-profile">
        <div class="avatar-container">
          <Icon name="ph:user-circle-light" class="avatar-placeholder" />
        </div>
        <h2 class="username">Guest User</h2>
      </div>

      <div class="unlock-section">
        <div
          class="fingerprint-sensor"
          :class="{ 'is-scanning': isUnlocking }"
          @mousedown="startUnlock"
          @mouseup="cancelUnlock"
          @mouseleave="cancelUnlock"
          @touchstart.prevent="startUnlock"
          @touchend.prevent="cancelUnlock"
        >
          <div class="sensor-icon-wrapper">
            <Icon
              :name="isUnlocking ? 'fluent:fingerprint-24-filled' : 'fluent:fingerprint-24-regular'"
              class="sensor-icon"
            />
          </div>

          <svg class="progress-ring" width="110" height="110">
            <circle
              class="progress-ring-bg"
              stroke="rgba(255, 255, 255, 0.05)"
              stroke-width="4"
              fill="transparent"
              r="50"
              cx="55"
              cy="55"
            />
            <circle
              class="progress-ring-circle"
              :style="{ strokeDashoffset: unlockProgress }"
              stroke="url(#grad1)"
              stroke-width="4"
              stroke-linecap="round"
              fill="transparent"
              r="50"
              cx="55"
              cy="55"
            />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#38bdf8;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#818cf8;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>

          <div class="glow-effect" />
        </div>

        <p class="instruction-text" :class="{ 'is-hidden': isUnlocking }">
          {{ $t('auth.fingerprintPrompt') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/composables/features/auth/useAuthStore';

const authStore = useAuthStore();
const isUnlocking = ref(false);
const progressValue = ref(0);
const unlockInterval = ref<number | null>(null);

const currentTime = ref('');
const currentDate = ref('');
let clockInterval: number | null = null;

const updateClock = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  currentDate.value = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
};

updateClock();

onMounted(() => {
  updateClock();
  clockInterval = window.setInterval(updateClock, 1000);
});

onUnmounted(() => {
  if (clockInterval !== null) {
    window.clearInterval(clockInterval);
  }
});

const maxProgress = 100;
const unlockDurationMs = 1500;
const tickRateMs = 16;
const circumference = 50 * 2 * Math.PI;

const unlockProgress = computed(() => {
  return circumference - (progressValue.value / 100) * circumference;
});

const startUnlock = () => {
  isUnlocking.value = true;
  progressValue.value = 0;

  const step = (maxProgress / unlockDurationMs) * tickRateMs;

  unlockInterval.value = window.setInterval(() => {
    progressValue.value += step;

    if (progressValue.value >= maxProgress) {
      finishUnlock();
    }
  }, tickRateMs);
};

const cancelUnlock = () => {
  isUnlocking.value = false;
  progressValue.value = 0;

  if (unlockInterval.value !== null) {
    window.clearInterval(unlockInterval.value);
    unlockInterval.value = null;
  }
};

const finishUnlock = () => {
  cancelUnlock();
  authStore.unlockOS();
};
</script>

<style scoped lang="scss">
.lock-screen-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100dvh;
  width: 100vw;
  background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
  color: #f8fafc;
  padding: 8vh 2rem;
  box-sizing: border-box;
  overflow: hidden;
}

.clock-widget {
  text-align: center;
  animation: fadeInDown 1s ease-out;

  .time {
    font-size: 6rem;
    font-weight: 100;
    margin: 0;
    letter-spacing: -3px;
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.1));
  }

  .date {
    font-size: 1.4rem;
    font-weight: 300;
    color: #94a3b8;
    margin-top: -5px;
    text-transform: capitalize;
  }
}

.auth-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3.5rem;
  animation: fadeInUp 1s ease-out;
}

.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;

  .avatar-container {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);

    .avatar-placeholder {
      font-size: 50px;
      color: #cbd5e1;
    }
  }

  .username {
    font-size: 1.6rem;
    font-weight: 400;
    margin: 0;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }
}

.unlock-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.fingerprint-sensor {
  position: relative;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  .sensor-icon-wrapper {
    z-index: 2;
    background: rgba(255, 255, 255, 0.05);
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    backdrop-filter: blur(5px);
    transition: all 0.3s ease;

    .sensor-icon {
      font-size: 38px;
      color: #94a3b8;
      transition: all 0.3s ease;
    }
  }

  .glow-effect {
    position: absolute;
    width: 80%;
    height: 80%;
    background: #38bdf8;
    filter: blur(40px);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &.is-scanning {
    transform: scale(0.92);

    .sensor-icon-wrapper {
      background: rgba(56, 189, 248, 0.1);
      .sensor-icon {
        color: #38bdf8;
        transform: scale(1.1);
      }
    }

    .glow-effect {
      opacity: 0.3;
    }
  }
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
  z-index: 3;
}

.progress-ring-circle {
  transition: stroke-dashoffset 0.05s linear;
  stroke-dasharray: 314.159; /* 50 * 2 * Math.PI */
}

.instruction-text {
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 300;
  letter-spacing: 1px;
  transition: all 0.4s ease;

  &.is-hidden {
    opacity: 0;
    transform: translateY(10px);
  }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
