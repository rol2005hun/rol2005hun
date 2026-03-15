<template>
  <div
    class="os-window-frame"
    :class="{
      'is-minimized': windowInfo.isMinimized,
      'is-maximized': windowInfo.isMaximized,
      'is-focused': isFocused
    }"
    :style="windowStyle"
    @mousedown="focusWindow"
  >
    <div class="window-header" @dblclick="toggleMaximize">
      <div class="window-title">
        <span>{{ $t(windowInfo.titleKey) }}</span>
      </div>
      <div class="window-controls">
        <button class="ctrl-btn minimize" @click.stop="toggleMinimize">
          <Icon name="ph:minus-bold" size="14px" />
        </button>
        <button class="ctrl-btn maximize" @click.stop="toggleMaximize">
          <Icon :name="windowInfo.isMaximized ? 'ph:copy-simple-bold' : 'ph:square-bold'" size="14px" />
        </button>
        <button class="ctrl-btn close" @click.stop="closeWindow">
          <Icon name="ph:x-bold" size="14px" />
        </button>
      </div>
    </div>

    <div class="window-body">
      <component :is="appComponents[windowInfo.appId]" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWindowStore } from '@/stores/features/os/useWindowStore';
import type { OSWindow } from '@/stores/features/os/useWindowStore';
import { appComponents } from '@/stores/features/os/useAppRegistry';

const props = defineProps<{
  windowInfo: OSWindow;
}>();

const windowStore = useWindowStore();

const isFocused = computed(() => {
  const allZIndexes = windowStore.windows.map(w => w.zIndex);
  const maxZ = Math.max(...allZIndexes, 0);
  return props.windowInfo.zIndex === maxZ && maxZ > 0;
});

const windowStyle = computed(() => {
  if (props.windowInfo.isMaximized) {
    return {
      zIndex: props.windowInfo.zIndex,
      top: '0px',
      left: '0px',
      width: '100%',
      height: '100%',
    };
  }

  return {
    zIndex: props.windowInfo.zIndex,
    top: `${props.windowInfo.y}px`,
    left: `${props.windowInfo.x}px`,
    width: `${props.windowInfo.width}px`,
    height: `${props.windowInfo.height}px`,
  };
});

const focusWindow = () => {
  windowStore.focusWindow(props.windowInfo.id);
};

const closeWindow = () => {
  windowStore.closeWindow(props.windowInfo.id);
};

const toggleMinimize = () => {
  windowStore.toggleMinimize(props.windowInfo.id);
};

const toggleMaximize = () => {
  windowStore.toggleMaximize(props.windowInfo.id);
};
</script>

<style scoped lang="scss">
.os-window-frame {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: var(--os-window-bg, rgba(30, 30, 30, 0.85));
  border: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.15));
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: opacity 0.2s, transform 0.2s;

  &.is-minimized {
    opacity: 0;
    pointer-events: none;
    transform: translateY(20px) scale(0.95);
  }

  &.is-maximized {
    border-radius: 0;
    border: none;
  }

  &.is-focused {
    box-shadow: 0 12px 50px rgba(0, 0, 0, 0.6);
    border-color: var(--os-primary-light, rgba(255, 255, 255, 0.3));
  }
}

.window-header {
  height: 38px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.05);
  user-select: none;
  cursor: default;
}

.window-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--os-text, #fff);
  display: flex;
  align-items: center;
}

.window-controls {
  display: flex;
  gap: 6px;
  align-items: center;

  .ctrl-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--os-text, #fff);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &.close:hover {
      background: #e81123;
      color: white;
    }
  }
}

.window-body {
  flex: 1;
  position: relative;
  overflow: hidden;
}
</style>
