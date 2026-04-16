<template>
  <div
    class="os-window-frame"
    :class="{
      'is-minimized': windowInfo.isMinimized,
      'is-maximized': windowInfo.isMaximized,
      'is-focused': isFocused,
      'is-dragging': isDragging,
      'is-resizing': isResizing
    }"
    :style="windowStyle"
    @mousedown="focusWindow">
    <div class="window-header" @dblclick="toggleMaximize" @mousedown="startDrag">
      <div class="window-title">
        <AppIcon :app-id="windowInfo.appId" size="14px" class="title-icon" />
        <span>{{ $t(windowInfo.titleKey) }}</span>
      </div>
      <div class="window-controls">
        <button class="ctrl-btn minimize" @click.stop="toggleMinimize">
          <Icon name="ph:minus-bold" size="12px" />
        </button>
        <button class="ctrl-btn maximize" @click.stop="toggleMaximize">
          <Icon
            :name="windowInfo.isMaximized ? 'ph:copy-simple-bold' : 'ph:square-bold'"
            size="12px" />
        </button>
        <button class="ctrl-btn close" @click.stop="closeWindow">
          <Icon name="ph:x-bold" size="12px" />
        </button>
      </div>
    </div>

    <div class="window-body">
      <component :is="appComponents[windowInfo.appId]" />
    </div>

    <div
      v-if="!windowInfo.isMaximized"
      class="resize-handle"
      @mousedown.stop.prevent="startResize" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineAsyncComponent } from 'vue';
import { useWindowStore } from '@/stores/features/os/useWindowStore';
import type { OSWindow } from '@/stores/features/os/useWindowStore';
import AppIcon from '@/components/features/os/shared/AppIcon.vue';

const appComponents: Record<string, any> = {
  settings: defineAsyncComponent(
    () => import('@/components/features/os/apps/settings/SettingsApp.vue')
  ),
  browser: defineAsyncComponent(
    () => import('@/components/features/os/apps/browser/BrowserApp.vue')
  ),
  terminal: defineAsyncComponent(
    () => import('@/components/features/os/apps/terminal/TerminalApp.vue')
  ),
  about: defineAsyncComponent(() => import('@/components/features/os/apps/about/AboutApp.vue')),
  projects: defineAsyncComponent(
    () => import('@/components/features/os/apps/projects/ProjectsApp.vue')
  ),
  music: defineAsyncComponent(() => import('@/components/features/os/apps/music/MusicApp.vue')),
  contact: defineAsyncComponent(
    () => import('@/components/features/os/apps/contact/ContactApp.vue')
  ),
  changelog: defineAsyncComponent(
    () => import('@/components/features/os/apps/changelog/ChangelogApp.vue')
  )
};

const props = defineProps<{
  windowInfo: OSWindow;
}>();

const windowStore = useWindowStore();

const isDragging = ref(false);
let startX = 0;
let startY = 0;
let initialWinX = 0;
let initialWinY = 0;

const startDrag = (e: MouseEvent) => {
  if (e.target instanceof Element && e.target.closest('.window-controls')) return;

  if (props.windowInfo.isMaximized) {
    return;
  }

  isDragging.value = true;
  startX = e.clientX;
  startY = e.clientY;
  initialWinX = props.windowInfo.x;
  initialWinY = props.windowInfo.y;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  let newX = initialWinX + dx;
  let newY = initialWinY + dy;

  const VISIBLE_MARGIN = 100;

  const surfaceEl = document.querySelector('.desktop-surface');
  const surfaceWidth = surfaceEl ? surfaceEl.clientWidth : window.innerWidth;
  const surfaceHeight = surfaceEl ? surfaceEl.clientHeight : window.innerHeight - 48;

  const HEADER_HEIGHT = 48;

  const minX = -(props.windowInfo.width - VISIBLE_MARGIN);
  const maxX = surfaceWidth - VISIBLE_MARGIN;

  const minY = 0;
  const maxY = surfaceHeight - HEADER_HEIGHT;

  newX = Math.max(minX, Math.min(newX, maxX));
  newY = Math.max(minY, Math.min(newY, maxY));

  windowStore.updateWindow(props.windowInfo.id, {
    x: newX,
    y: newY
  });
};

const stopDrag = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
};

const isResizing = ref(false);
let startResizeX = 0;
let startResizeY = 0;
let initialWidth = 0;
let initialHeight = 0;

const startResize = (e: MouseEvent) => {
  if (props.windowInfo.isMaximized) return;
  isResizing.value = true;
  startResizeX = e.clientX;
  startResizeY = e.clientY;
  initialWidth = props.windowInfo.width;
  initialHeight = props.windowInfo.height;

  window.addEventListener('mousemove', onResize);
  window.addEventListener('mouseup', stopResize);
};

const onResize = (e: MouseEvent) => {
  if (!isResizing.value) return;

  let newWidth = initialWidth + (e.clientX - startResizeX);
  let newHeight = initialHeight + (e.clientY - startResizeY);

  const MIN_WIDTH = 550;
  const MIN_HEIGHT = 450;

  if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
  if (newHeight < MIN_HEIGHT) newHeight = MIN_HEIGHT;

  windowStore.updateWindow(props.windowInfo.id, {
    width: newWidth,
    height: newHeight
  });
};

const stopResize = () => {
  isResizing.value = false;
  window.removeEventListener('mousemove', onResize);
  window.removeEventListener('mouseup', stopResize);
};

const isFocused = computed(() => {
  const allZIndexes = windowStore.windows.map((w) => w.zIndex);
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
      height: '100%'
    };
  }

  return {
    zIndex: props.windowInfo.zIndex,
    top: `${props.windowInfo.y}px`,
    left: `${props.windowInfo.x}px`,
    width: `${props.windowInfo.width}px`,
    height: `${props.windowInfo.height}px`
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
  min-width: 550px;
  min-height: 450px;
  background: var(--os-window-bg, rgba(30, 30, 30, 0.85));
  border: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.15));
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

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
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
    border-color: var(--os-primary-color, rgba(255, 255, 255, 0.3));
  }

  &.is-dragging,
  &.is-resizing {
    transition: none;
    opacity: 0.95;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
  }
}

.window-header {
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.05);
  user-select: none;
  cursor: default;
}

.window-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--os-text, #fff);
  display: flex;
  align-items: center;
  gap: 12px;

  .title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.window-controls {
  display: flex;
  gap: 12px;
  align-items: center;

  .ctrl-btn {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
    color: transparent;

    &:hover {
      color: rgba(0, 0, 0, 0.6);
    }

    &.close {
      background: #ff5f56;
      border: 1px solid #e0443e;
      &:hover {
        background: #ff5f56;
      }
    }

    &.minimize {
      background: #ffbd2e;
      border: 1px solid #dea123;
      &:hover {
        background: #ffbd2e;
      }
    }

    &.maximize {
      background: #27c93f;
      border: 1px solid #1aab29;
      &:hover {
        background: #27c93f;
      }
    }
  }
}

.window-body {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.resize-handle {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 16px;
  height: 16px;
  cursor: se-resize;
  z-index: 100;

  &::after {
    content: '';
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 8px;
    height: 8px;
    border-right: 2px solid rgba(255, 255, 255, 0.3);
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  }

  &:hover::after {
    border-color: rgba(255, 255, 255, 0.6);
  }
}
</style>
