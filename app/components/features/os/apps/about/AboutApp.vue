<template>
  <div class="app-container about-app">
    <div class="about-header">
      <div class="os-logo">
        <Icon name="ph:monitor-fill" class="logo-icon" />
      </div>
      <h2>ranzakOS</h2>
      <p class="subtitle">{{ $t('os.apps.about.copyright') }}</p>
    </div>

    <div class="info-section">
      <h3>{{ $t('os.apps.about.osInfo') }}</h3>
      <ul class="info-list">
        <li><span>{{ $t('os.apps.about.osName') }}:</span> ranzakOS</li>
        <li><span>{{ $t('os.apps.about.osVersion') }}:</span> 1.0.0 (Build 2026.03)</li>
        <li><span>{{ $t('os.apps.about.osKernel') }}:</span> ranzak-core v2.4</li>
        <li><span>{{ $t('os.apps.about.osEnv') }}:</span> Web-based Desktop</li>
      </ul>
    </div>

    <div class="info-section">
      <h3>{{ $t('os.apps.about.deviceInfo') }}</h3>
      <ul class="info-list">
        <li><span>{{ $t('os.apps.about.cpu') }}:</span> {{ hardwareConcurrency }}</li>
        <li><span>{{ $t('os.apps.about.ram') }}:</span> {{ deviceMemory }}</li>
        <li><span>{{ $t('os.apps.about.screenWidth') }}:</span> {{ screenWidth }} x {{ screenHeight }}</li>
        <li><span>{{ $t('os.apps.about.language') }}:</span> {{ language }}</li>
        <li class="browser-info"><span>{{ $t('os.apps.about.browser') }}:</span> {{ browserInfo }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const hardwareConcurrency = ref<string>('N/A');
const deviceMemory = ref<string>('N/A');
const screenWidth = ref<number>(0);
const screenHeight = ref<number>(0);
const language = ref<string>('N/A');
const browserInfo = ref<string>('N/A');

onMounted(() => {
  if (typeof window !== 'undefined' && window.navigator) {
    const nav = window.navigator as any;

    hardwareConcurrency.value = nav.hardwareConcurrency ? nav.hardwareConcurrency.toString() : 'N/A';
    deviceMemory.value = nav.deviceMemory ? `~${nav.deviceMemory} GB` : 'N/A';

    screenWidth.value = window.screen.width;
    screenHeight.value = window.screen.height;

    language.value = nav.language || 'N/A';
    browserInfo.value = nav.userAgent || 'N/A';
  }
});
</script>

<style scoped lang="scss">
.about-app {
  padding: 24px;
  color: var(--os-text, #fff);
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.about-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 32px;

  .os-logo {
    width: 64px;
    height: 64px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;

    .logo-icon {
      font-size: 32px;
      color: var(--os-text, #fff);
    }
  }

  h2 {
    font-size: 24px;
    margin: 0 0 4px 0;
    font-weight: 600;
  }

  .subtitle {
    font-size: 12px;
    color: #aaa;
    margin: 0;
  }
}

.info-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;

  h3 {
    font-size: 14px;
    margin: 0 0 16px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #888;
  }
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 14px;
    margin-bottom: 12px;
    display: flex;
    line-height: 1.4;

    &:last-child {
      margin-bottom: 0;
    }

    span {
      font-weight: 500;
      width: 150px;
      flex-shrink: 0;
      color: #aaa;
    }

    &.browser-info {
      flex-direction: column;

      span {
        margin-bottom: 4px;
        width: auto;
      }
    }
  }
}
</style>
