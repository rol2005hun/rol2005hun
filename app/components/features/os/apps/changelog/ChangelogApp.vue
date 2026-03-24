<template>
  <div class="app-container changelog-app">
    <div class="changelog-header">
      <div class="header-icon">
        <Icon name="ph:list-dashes-bold" />
      </div>
      <h2>{{ $t('os.apps.changelog.title') }}</h2>
      <p class="subtitle">{{ $t('os.apps.changelog.subtitle') }}</p>
    </div>

    <div class="changelog-content">
      <div v-if="!versions || versions.length === 0" class="empty-state">
        <Icon name="ph:empty" class="empty-icon" />
        <p>{{ $t('os.apps.changelog.empty') }}</p>
      </div>

      <div v-for="v in versions" :key="v.version" class="version-entry">
        <div class="version-header">
          <div class="version-badge">
            <span class="v-text">v</span>
            {{ v.version }}
          </div>
          <span class="version-date">{{ v.date }}</span>
        </div>
        <h3 class="version-title">{{ v.title }}</h3>
        <ul class="changes-list">
          <li v-for="(change, idx) in v.changes" :key="idx" class="change-item">
            <div class="change-bullet">
              <Icon name="ph:check-circle-fill" />
            </div>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="change-text" v-html="change" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { tm } = useI18n({ useScope: 'global' });

const versions = computed(() => {
  const data = tm('os.apps.changelog.history') as Record<string, any>;
  if (!data || typeof data !== 'object') {
    return [];
  }

  return Object.keys(data)
    .map((dateKey) => ({
      date: dateKey,
      ...data[dateKey]
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});
</script>

<style scoped lang="scss">
.changelog-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: var(--os-text, #fff);
  background: transparent;
  overflow: hidden;
}

.changelog-header {
  padding: 24px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex-shrink: 0;
  backdrop-filter: blur(10px);

  .header-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);

    font-size: 28px;
    color: #fff;
  }

  h2 {
    font-size: 22px;
    margin: 0 0 4px 0;
    font-weight: 600;
  }

  .subtitle {
    font-size: 13px;
    color: #aaa;
    margin: 0;
  }
}

.changelog-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
}

.version-entry {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 12px;

  .version-badge {
    background: rgba(255, 255, 255, 0.15);
    padding: 4px 10px;
    border-radius: 6px;
    font-family: monospace;
    font-size: 14px;
    font-weight: 600;
    color: #fff;

    .v-text {
      color: #aaa;
      margin-right: 2px;
      font-weight: normal;
    }
  }

  .version-date {
    font-size: 13px;
    color: #888;
  }
}

.version-title {
  font-size: 18px;
  margin: 0 0 16px 0;
  font-weight: 500;
  color: #eee;
}

.changes-list {
  list-style: none;
  padding: 0;
  margin: 0;

  .change-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
    line-height: 1.5;

    &:last-child {
      margin-bottom: 0;
    }

    .change-bullet {
      color: #4ade80;
      font-size: 16px;
      margin-right: 12px;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .change-text {
      font-size: 14px;
      color: #ddd;

      :deep(strong) {
        color: #fff;
        font-weight: 600;
      }

      :deep(em) {
        color: #a78bfa;
        font-style: normal;
        background: rgba(167, 139, 250, 0.2);
        padding: 0 4px;
        border-radius: 4px;
      }
    }
  }
}
</style>
