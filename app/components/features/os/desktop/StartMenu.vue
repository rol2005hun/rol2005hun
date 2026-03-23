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
          {{
            searchQuery
              ? $t('os.startMenu.searchResults', 'Keresési eredmények')
              : $t('os.startMenu.pinnedApps')
          }}
        </h3>
        <div class="app-grid">
          <div v-for="app in filteredApps" :key="app.id" class="app-item" @click="openApp(app.id)">
            <div class="icon-box">
              <AppIcon :app-id="app.id" size="28px" />
            </div>
            <span>{{ $t(app.nameKey) }}</span>
          </div>
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
      <button class="power-btn" @click="systemStore.requestShutdown()">
        <Icon name="ph:power-bold" size="18px" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
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
const { messages } = useI18n();

const searchQuery = ref('');
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

const filteredApps = computed(() => {
  const visibleApps = registryStore.installedApps.filter((app) => app.showInStartMenu !== false);

  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return visibleApps;

  return visibleApps.filter((app) => {
    const keyPath = app.nameKey.split('.');

    for (const locale of Object.keys(messages.value)) {
      let currentVal: any = messages.value[locale];

      for (const key of keyPath) {
        if (currentVal && currentVal[key]) {
          currentVal = currentVal[key];
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
  width: 400px;
  height: 500px;
  background: var(--os-menu-bg, rgba(30, 30, 30, 0.85));
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.start-menu-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 20px;

  input {
    background: transparent;
    border: none;
    outline: none;
    color: var(--os-text, #fff);
    width: 100%;
    font-size: 14px;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
}

.pinned-section {
  h3 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 15px;
    padding-left: 5px;
  }
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .icon-box {
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--os-primary-light, rgba(255, 255, 255, 0.1));
    border-radius: 12px;
    color: var(--os-primary-color, #fff);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  span {
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
}

.start-menu-footer {
  height: 60px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px 5px 5px;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  span {
    font-size: 13px;
    font-weight: 500;
  }
}

.power-btn {
  background: transparent;
  border: none;
  color: var(--os-text, #fff);
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 0, 0, 0.5);
  }
}
</style>
