<template>
  <div ref="menuRef" class="start-menu-container">
    <div class="start-menu-content">
      <div class="search-bar">
        <Icon name="ph:magnifying-glass" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('os.startMenu.searchPlaceholder')" />
      </div>

      <div class="pinned-section">
        <h3>
          {{ searchQuery ? $t('os.startMenu.searchResults') : $t('os.startMenu.pinnedApps') }}
        </h3>
        <div class="app-grid">
          <div v-for="app in paginatedApps" :key="app.id" class="app-item" @click="openApp(app.id)">
            <div class="icon-box">
              <AppIcon :app-id="app.id" size="28px" />
            </div>
            <span>{{ $t(app.nameKey) }}</span>
          </div>
        </div>

        <div v-if="!searchQuery && totalPages > 1" class="pagination">
          <button
            v-for="page in totalPages"
            :key="page"
            class="page-dot"
            :class="{ active: currentPage === page - 1 }"
            @click="currentPage = page - 1"></button>
        </div>
      </div>
    </div>

    <div class="start-menu-footer">
      <div class="user-profile">
        <div class="avatar">
          <Icon name="ph:user-fill" />
        </div>
        <span>{{ $t('os.startMenu.user') }}</span>
      </div>
      <div class="power-wrapper">
        <button class="power-btn" @click="systemStore.initiateShutdown()">
          <Icon name="ph:power-bold" size="18px" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppRegistry } from '@/stores/features/os/useAppRegistry';
import { useWindowStore } from '@/stores/features/os/useWindowStore';
import { useDesktopStore } from '@/stores/features/os/useDesktopStore';
import { useSystemStore } from '@/stores/features/os/useSystemStore';
import AppIcon from '@/components/features/os/shared/AppIcon.vue';

const registryStore = useAppRegistry();
const windowStore = useWindowStore();
const desktopStore = useDesktopStore();
const systemStore = useSystemStore();
const { messages } = useI18n({ useScope: 'global' });

const searchQuery = ref('');
const currentPage = ref(0);
const pageSize = 9;
const menuRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.closest('.start-btn')) return;

  if (menuRef.value && !menuRef.value.contains(target)) {
    desktopStore.closeStartMenu();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

// Reset page on search
watch(searchQuery, () => {
  currentPage.value = 0;
});

const filteredApps = computed(() => {
  const visibleApps = registryStore.installedApps.filter((app) => app.showInStartMenu !== false);

  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return visibleApps;

  return visibleApps.filter((app) => {
    const keyPath = app.nameKey.split('.');

    for (const locale of Object.keys(messages.value)) {
      let currentVal: unknown = (messages.value as Record<string, unknown>)[locale];

      for (const key of keyPath) {
        if (
          currentVal &&
          typeof currentVal === 'object' &&
          (currentVal as Record<string, unknown>)[key]
        ) {
          currentVal = (currentVal as Record<string, unknown>)[key];
        } else {
          currentVal = null;
          break;
        }
      }

      if (typeof currentVal === 'string' && currentVal.toLowerCase().includes(query)) {
        return true;
      }
    }

    if (app.id.toLowerCase().includes(query)) {
      return true;
    }

    return false;
  });
});

const totalPages = computed(() => Math.ceil(filteredApps.value.length / pageSize));

const paginatedApps = computed(() => {
  if (searchQuery.value) return filteredApps.value;
  const start = currentPage.value * pageSize;
  return filteredApps.value.slice(start, start + pageSize);
});

const openApp = (appId: string) => {
  searchQuery.value = '';
  const appConfig = registryStore.getAppById(appId);
  if (appConfig) {
    windowStore.openWindow({
      id: `${appId}-${Date.now()}`,
      appId: appConfig.id,
      titleKey: appConfig.nameKey,
      width: appConfig.defaultWidth || 800,
      height: appConfig.defaultHeight || 600
    });
  }
  desktopStore.closeStartMenu();
};
</script>

<style scoped lang="scss">
.start-menu-container {
  width: 440px;
  height: 580px;
  background: var(--os-menu-bg, rgba(20, 20, 20, 0.85));
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.15));
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.start-menu-content {
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 18px;
  border-radius: 24px;
  transition: background 0.3s, border-color 0.3s;

  &:focus-within {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    color: var(--os-text, #fff);
    width: 100%;
    font-size: 15px;

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }
}

.pinned-section {
  display: flex;
  flex-direction: column;
  flex: 1;

  h3 {
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 20px;
    padding-left: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: rgba(255, 255, 255, 0.6);
  }
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  flex: 1;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  .icon-box {
    width: 54px;
    height: 54px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    color: var(--os-text, #fff);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  span {
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    color: rgba(255, 255, 255, 0.9);
  }
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  padding-bottom: 10px;

  .page-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }

    &.active {
      background: #fff;
      width: 20px;
      border-radius: 4px;
    }
  }
}

.start-menu-footer {
  height: 80px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px 8px 8px;
  border-radius: 12px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  span {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }
}

.power-wrapper {
  padding: 4px;
  border-radius: 12px;
  transition: background 0.2s;
}

.power-btn {
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.2);
  color: #ff3b30;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 59, 48, 0.8);
    color: #fff;
    box-shadow: 0 0 15px rgba(255, 59, 48, 0.4);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
