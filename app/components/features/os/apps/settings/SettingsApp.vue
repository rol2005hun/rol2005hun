<template>
  <div class="settings-app">
    <div class="sidebar">
      <ul>
        <li class="active">
          <Icon name="ph:paint-brush-broad-fill" /> Appearance
        </li>
      </ul>
    </div>
    <div class="content">
      <h2>Theme Selection</h2>
      <p class="subtitle">Choose your personal operating system style.</p>

      <div class="theme-grid">
        <button
          v-for="theme in themeStore.availableThemes"
          :key="theme.id"
          class="theme-card"
          :class="{ active: themeStore.currentTheme === theme.id }"
          @click="themeStore.setTheme(theme.id)"
        >
          <div class="color-preview" :style="{ backgroundColor: theme.color }"/>
          <span>{{ theme.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/features/os/useThemeStore';

const themeStore = useThemeStore();
</script>

<style scoped lang="scss">
.settings-app {
  display: flex;
  width: 100%;
  height: 100%;
  background: var(--os-window-bg, rgba(30, 30, 30, 0.95));
  color: var(--os-text, #fff);
  border-radius: inherit;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid var(--os-border-color, rgba(255,255,255,0.1));
  padding: 20px 10px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 10px 15px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      transition: background 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
      &.active {
        background: var(--os-primary-color, rgba(255, 255, 255, 0.1));
        font-weight: 600;
      }
    }
  }
}

.content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;

  h2 {
    margin-bottom: 5px;
    font-size: 24px;
    font-weight: 600;
  }

  .subtitle {
    font-size: 14px;
    opacity: 0.7;
    margin-bottom: 30px;
  }
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
}

.theme-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--os-border-color, rgba(255,255,255,0.1));
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--os-text, #fff);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &.active {
    border-color: var(--os-primary-color, #fff);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  }

  .color-preview {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    border: 2px solid rgba(255,255,255,0.2);
  }

  span {
    font-size: 13px;
    font-weight: 500;
  }
}
</style>
