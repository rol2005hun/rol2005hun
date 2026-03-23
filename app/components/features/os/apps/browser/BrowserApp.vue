<template>
  <div class="browser-app">
    <div class="browser-toolbar">
      <button class="nav-btn" :disabled="!canGoBack" title="Vissza" @click="goBack">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>
      <button class="nav-btn" :disabled="!canGoForward" title="Előre" @click="goForward">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
      <button class="nav-btn" title="Frissítés" @click="refresh">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
      </button>

      <div class="address-bar-container">
        <input
          v-model="inputUrl"
          type="text"
          class="address-bar"
          placeholder="https://..."
          @keyup.enter="navigate" />
      </div>

      <button class="nav-btn" title="Ugrás" @click="navigate">
        <span>Go</span>
      </button>
    </div>

    <div class="browser-content">
      <iframe
        v-if="currentUrl"
        :key="iframeKey"
        :src="currentUrl"
        class="browser-iframe"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
      <div v-else class="empty-state">Üres oldal</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCookie } from '#imports';

const inputUrl = ref('https://chrcountback.netlify.app/');
const currentUrl = ref('');
const iframeKey = ref(0);

const historyCookie = useCookie<string[]>('browser_history', {
  default: () => [],
  maxAge: 31536000
});
const history = ref<string[]>([]);
const currentIndex = ref(-1);

onMounted(() => {
  if (historyCookie.value && historyCookie.value.length > 0) {
    history.value = [...historyCookie.value];
    currentIndex.value = history.value.length - 1;
    const initialUrl = history.value[currentIndex.value] || '';
    currentUrl.value = initialUrl;
    inputUrl.value = initialUrl;
  } else {
    navigate();
  }
});

const canGoBack = computed(() => currentIndex.value > 0);
const canGoForward = computed(() => currentIndex.value < history.value.length - 1);

const formatUrl = (url: string) => {
  if (!url) return '';
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url;
  }
  return url;
};

const navigate = () => {
  let destination = formatUrl(inputUrl.value);
  if (!destination) return;

  if (destination !== currentUrl.value) {
    history.value = history.value.slice(0, currentIndex.value + 1);
    history.value.push(destination);
    currentIndex.value++;
    saveHistory();
  }

  currentUrl.value = destination;
  inputUrl.value = destination;
};

const goBack = () => {
  if (canGoBack.value) {
    currentIndex.value--;
    const dest = history.value[currentIndex.value] || '';
    currentUrl.value = dest;
    inputUrl.value = dest;
  }
};

const goForward = () => {
  if (canGoForward.value) {
    currentIndex.value++;
    const dest = history.value[currentIndex.value] || '';
    currentUrl.value = dest;
    inputUrl.value = dest;
  }
};

const refresh = () => {
  iframeKey.value++;
};

const saveHistory = () => {
  if (history.value.length > 50) {
    history.value = history.value.slice(-50);
    currentIndex.value = history.value.length - 1;
  }
  historyCookie.value = [...history.value];
};
</script>

<style scoped lang="scss">
.browser-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--os-window-bg);
  color: var(--os-text);
  overflow: hidden;
}

.browser-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--os-border-color);
}

.nav-btn {
  background: transparent;
  border: none;
  color: var(--os-text);
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.address-bar-container {
  flex: 1;
  display: flex;
}

.address-bar {
  width: 100%;
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid var(--os-border-color);
  background-color: rgba(0, 0, 0, 0.3);
  color: var(--os-text);
  font-family: inherit;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: rgba(255, 255, 255, 0.3);
    background-color: rgba(0, 0, 0, 0.4);
  }
}

.browser-content {
  flex: 1;
  position: relative;
  background-color: #fff;
}

.browser-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  font-size: 14px;
}
</style>
