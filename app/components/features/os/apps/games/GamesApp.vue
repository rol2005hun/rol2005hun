<template>
  <div class="games-app">
    <Transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <Icon name="ph:spinner-gap-bold" class="spinner" />
          <h2 class="loading-text">{{ $t('os.apps.games.loading') }}</h2>
          <p class="lang-warning">
            <Icon name="ph:warning-circle-fill" class="warning-icon" />
            {{ $t('os.apps.games.langWarning') }}
          </p>
        </div>
      </div>
    </Transition>

    <iframe
      v-show="!isLoading"
      src="https://play.wolimby.site"
      frameborder="0"
      class="games-iframe"
      allow="fullscreen"
      allowfullscreen
      @load="handleIframeLoad"></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isLoading = ref(true);

const handleIframeLoad = () => {
  isLoading.value = false;
};
</script>

<style scoped lang="scss">
.games-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--os-window-bg);
  position: relative;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: color-mix(in srgb, var(--os-window-bg) 95%, transparent);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 30px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--os-window-bg) 50%, rgba(255, 255, 255, 0.05));
  border: 1px solid color-mix(in srgb, var(--os-border, #444) 30%, transparent);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.spinner {
  font-size: 48px;
  color: #0078d4;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--os-text);
  margin: 0;
}

.lang-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: color-mix(in srgb, var(--os-text) 70%, transparent);
  max-width: 300px;
  line-height: 1.4;
  margin: 0;
  padding-top: 8px;
  border-top: 1px solid color-mix(in srgb, var(--os-border, #444) 30%, transparent);
}

.warning-icon {
  font-size: 18px;
  color: #f5a623;
  flex-shrink: 0;
}

.games-iframe {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  background: #000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
