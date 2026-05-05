<template>
  <div class="global-search-overlay" @click.self="desktopStore.closeSearch()">
    <div class="search-container glass-panel">
      <div class="search-input-wrapper">
        <Icon name="ph:magnifying-glass-bold" class="search-icon" />
        <input
          ref="searchInput"
          v-model="query"
          type="text"
          :placeholder="$t('os.search.placeholder')"
          @keydown.down.prevent="moveSelection(1)"
          @keydown.up.prevent="moveSelection(-1)"
          @keydown.enter="handleEnter"
          @keydown.esc="desktopStore.closeSearch()" />
      </div>

      <div v-if="results.length > 0" class="results-list">
        <div
          v-for="(result, index) in results"
          :key="result.id"
          class="result-item"
          :class="{ active: index === selectedIndex }"
          @click="openApp(result)"
          @mouseenter="selectedIndex = index">
          <AppIcon :app-id="result.id" size="24px" />
          <div class="result-info">
            <span class="result-name">{{ $t(result.titleKey) }}</span>
            <span v-if="result.descriptionKey" class="result-desc">
              {{ $t(result.descriptionKey) }}
            </span>
          </div>
          <Icon name="ph:arrow-return-left-bold" class="enter-icon" />
        </div>
      </div>

      <div v-else-if="query" class="no-results">
        <div class="web-search" @click="searchWeb">
          <Icon name="ph:globe-bold" />
          <span>{{ $t('os.search.searchWeb', { query }) }}</span>
        </div>
      </div>

      <div class="search-footer">
        <div class="hint">
          <kbd>↑↓</kbd> {{ $t('os.search.navigate') }}
        </div>
        <div class="hint">
          <kbd>Enter</kbd> {{ $t('os.search.open') }}
        </div>
        <div class="hint">
          <kbd>Esc</kbd> {{ $t('os.search.close') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useDesktopStore } from '@/stores/features/os/useDesktopStore';
import { useAppRegistry } from '@/stores/features/os/useAppRegistry';
import { useWindowStore } from '@/stores/features/os/useWindowStore';
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/features/os/shared/AppIcon.vue';

const desktopStore = useDesktopStore();
const appRegistry = useAppRegistry();
const windowStore = useWindowStore();
const { t } = useI18n();

const query = ref('');
const selectedIndex = ref(0);
const searchInput = ref<HTMLInputElement | null>(null);

const results = computed(() => {
  if (!query.value.trim()) return [];
  const q = query.value.toLowerCase();
  return appRegistry.installedApps.filter((app) => {
    const name = t(app.titleKey).toLowerCase();
    const desc = app.descriptionKey ? t(app.descriptionKey).toLowerCase() : '';
    return name.includes(q) || desc.includes(q);
  });
});

watch(query, () => {
  selectedIndex.value = 0;
});

const moveSelection = (dir: number) => {
  const count = results.value.length;
  if (count === 0) return;
  selectedIndex.value = (selectedIndex.value + dir + count) % count;
};

const handleEnter = () => {
  if (results.value.length > 0) {
    openApp(results.value[selectedIndex.value]);
  } else if (query.value.trim()) {
    searchWeb();
  }
};

const openApp = (app: any) => {
  windowStore.openWindow({
    id: app.id,
    appId: app.id,
    titleKey: app.titleKey,
    width: app.defaultWidth || 800,
    height: app.defaultHeight || 600
  });
  desktopStore.closeSearch();
};

const searchWeb = () => {
  window.open(`https://www.google.com/search?q=${encodeURIComponent(query.value)}`, '_blank');
  desktopStore.closeSearch();
};

onMounted(() => {
  setTimeout(() => {
    searchInput.value?.focus();
  }, 50);
});
</script>

<style scoped lang="scss">
.global-search-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  z-index: 10001;
  display: flex;
  justify-content: center;
  padding-top: 15vh;
}

.search-container {
  width: 600px;
  max-width: 90vw;
  height: fit-content;
  background: rgba(25, 25, 25, 0.85);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .search-icon {
    font-size: 24px;
    color: var(--os-primary-color, #3b82f6);
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    color: white;
    font-size: 20px;
    font-weight: 500;
    outline: none;
    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
  }
}

.results-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
}

.result-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  gap: 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &.active {
    background: rgba(255, 255, 255, 0.1);
    .enter-icon { opacity: 0.5; }
  }

  .result-info {
    flex: 1;
    display: flex;
    flex-direction: column;

    .result-name {
      font-size: 15px;
      font-weight: 600;
      color: white;
    }

    .result-desc {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 2px;
    }
  }

  .enter-icon {
    font-size: 14px;
    color: white;
    opacity: 0;
    transition: opacity 0.2s;
  }
}

.no-results {
  padding: 20px;
  text-align: center;
}

.web-search {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  color: white;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--os-primary-color, #3b82f6);
  }

  span { font-weight: 500; }
}

.search-footer {
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  .hint {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    display: flex;
    align-items: center;
    gap: 5px;

    kbd {
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 4px;
      border-radius: 4px;
      color: rgba(255, 255, 255, 0.7);
      font-family: monospace;
    }
  }
}
</style>
