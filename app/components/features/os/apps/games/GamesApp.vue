<template>
  <div class="games-app">
    <Transition name="fade" mode="out-in">
      <div v-if="!selectedGameUrl" class="game-selector">
        <h2 class="selector-title">{{ $t('os.apps.games.select') }}</h2>
        <div class="game-grid">
          <div v-for="game in games" :key="game.id" class="game-card" @click="selectGame(game.url)">
            <div class="game-icon-wrapper">
              <Icon :name="game.icon" class="game-icon" />
            </div>
            <div class="game-info">
              <h3 class="game-name">{{ game.name }}</h3>
              <p class="game-desc">{{ $t(game.descriptionKey) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="iframe-container">
        <div class="iframe-header">
          <button class="back-btn" @click="goBack">
            <Icon name="ph:arrow-left-bold" />
            <span>{{ $t('os.apps.games.back') }}</span>
          </button>
        </div>

        <div class="iframe-wrapper">
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
            :src="selectedGameUrl"
            frameborder="0"
            class="games-iframe"
            allow="fullscreen"
            allowfullscreen
            @load="handleIframeLoad"></iframe>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Game {
  id: string;
  name: string;
  url: string;
  icon: string;
  descriptionKey: string;
}

const games: Game[] = [
  {
    id: 'ranzagg',
    name: 'ranzaGG',
    url: 'https://gg.ranzak.dev',
    icon: 'ph:globe-hemisphere-east-duotone',
    descriptionKey: 'os.apps.games.desc.ranzagg'
  },
  {
    id: 'opnexus',
    name: 'Operation: NEXUS',
    url: 'https://opnexus.netlify.app',
    icon: 'ph:laptop-duotone',
    descriptionKey: 'os.apps.games.desc.opnexus'
  },
  {
    id: 'wolimby',
    name: 'Wolimby Games',
    url: 'https://wolimbygames.netlify.app',
    icon: 'ph:game-controller-duotone',
    descriptionKey: 'os.apps.games.desc.wolimby'
  }
];

const selectedGameUrl = ref<string | null>(null);
const isLoading = ref<boolean>(false);

const selectGame = (url: string): void => {
  isLoading.value = true;
  selectedGameUrl.value = url;
};

const handleIframeLoad = (): void => {
  isLoading.value = false;
};

const goBack = (): void => {
  selectedGameUrl.value = null;
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

.game-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  height: 100%;
  overflow-y: auto;
}

.selector-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--os-text);
  margin-bottom: 40px;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1000px;
}

.game-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 24px;
  background: color-mix(in srgb, var(--os-window-bg) 60%, rgba(255, 255, 255, 0.05));
  border: 1px solid color-mix(in srgb, var(--os-border, #444) 40%, transparent);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.game-card:hover {
  transform: translateY(-8px);
  background: color-mix(in srgb, var(--os-window-bg) 80%, rgba(255, 255, 255, 0.1));
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  border-color: #0078d4;
}

.game-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: color-mix(in srgb, #0078d4 15%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: #0078d4;
}

.game-icon {
  font-size: 40px;
}

.game-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.game-name {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--os-text);
}

.game-desc {
  margin: 0;
  font-size: 14px;
  color: color-mix(in srgb, var(--os-text) 70%, transparent);
  line-height: 1.5;
}

.iframe-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.iframe-header {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: color-mix(in srgb, var(--os-window-bg) 95%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--os-border, #444) 30%, transparent);
  backdrop-filter: blur(10px);
  z-index: 20;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--os-text);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.back-btn:hover {
  background: color-mix(in srgb, var(--os-text) 10%, transparent);
}

.iframe-wrapper {
  position: relative;
  flex: 1;
  width: 100%;
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
  display: block;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
