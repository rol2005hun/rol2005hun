<template>
  <div class="desktop-environment" @click.self="handleDesktopClick" @mousedown.self="startSelection" @contextmenu.prevent="openContextMenu">

    <div
      v-if="contextMenu.isOpen"
      class="context-menu"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
      @click.stop>
      <div class="context-item" @click="refreshDesktop">Frissítés</div>
      <div class="context-item" @click="changeWallpaper">Háttérkép módosítása</div>
      <div class="context-item" @click="openSysSettings">Rendszerbeállítások</div>
    </div>

    <div ref="surfaceRef" class="desktop-surface" @click.self="handleDesktopClick" @mousedown.self="startSelection" @contextmenu.prevent="openContextMenu">

      <div v-if="isSelecting" class="selection-box" :style="selectionBoxStyle"/>

      <ClientOnly>
        <DesktopIcon
          v-for="icon in desktopStore.icons"
          :key="icon.id"
          :icon="icon"
          :is-selected="desktopStore.selectedIcons.includes(icon.id)"
        />

        <WindowFrame
          v-for="win in windowStore.windows"
          :key="win.id"
          :window-info="win"
        />
      </ClientOnly>
    </div>

    <Transition name="slide-up">
      <StartMenu v-if="desktopStore.isStartMenuOpen" class="start-menu-panel" />
    </Transition>

    <Taskbar class="fixed-bottom" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import Taskbar from '~/components/features/os/taskbar/Taskbar.vue';
import StartMenu from '~/components/features/os/desktop/StartMenu.vue';
import WindowFrame from '~/components/features/os/window/WindowFrame.vue';
import DesktopIcon from '~/components/features/desktop/DesktopIcon.vue';
import { useDesktopStore } from '~/stores/features/os/useDesktopStore';
import { useWindowStore } from '~/stores/features/os/useWindowStore';

const desktopStore = useDesktopStore();
const windowStore = useWindowStore();
const surfaceRef = ref<HTMLElement | null>(null);

const contextMenu = reactive({
  isOpen: false,
  x: 0,
  y: 0
});

const openContextMenu = (e: MouseEvent) => {
  desktopStore.closeStartMenu();
  contextMenu.x = e.clientX;
  contextMenu.y = e.clientY;
  contextMenu.isOpen = true;
};

const closeContextMenu = () => {
  contextMenu.isOpen = false;
};

let isDragging = false;

const handleDesktopClick = () => {
  desktopStore.closeStartMenu();
  closeContextMenu();
  if (!isDragging) {
    desktopStore.clearSelection();
  }
};

const refreshDesktop = () => {
  desktopStore.resetIcons();
  closeContextMenu();
};
const changeWallpaper = () => {
  alert('Nincs implementálva');
  closeContextMenu();
};
const openSysSettings = () => {
  windowStore.openWindow({
    id: `settings-${Date.now()}`,
    appId: 'settings',
    titleKey: 'os.apps.settings.name',
    width: 600,
    height: 500
  });
  closeContextMenu();
};

const isSelecting = ref(false);
const startX = ref(0);
const startY = ref(0);
const currentX = ref(0);
const currentY = ref(0);

const startSelection = (e: MouseEvent) => {
  if (e.button !== 0) return;

  isDragging = false;
  closeContextMenu();
  desktopStore.closeStartMenu();
  desktopStore.clearSelection();

  isSelecting.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
  currentX.value = e.clientX;
  currentY.value = e.clientY;

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = (e: MouseEvent) => {
  if (!isSelecting.value) return;
  isDragging = true;
  currentX.value = e.clientX;
  currentY.value = e.clientY;

  updateSelection();
};

const onMouseUp = () => {
  isSelecting.value = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};

const selectionBoxStyle = computed(() => {
  const left = Math.min(startX.value, currentX.value);
  const top = Math.min(startY.value, currentY.value);
  const width = Math.abs(currentX.value - startX.value);
  const height = Math.abs(currentY.value - startY.value);

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`
  };
});

const updateSelection = () => {
  if (!surfaceRef.value) return;

  const left = Math.min(startX.value, currentX.value);
  const top = Math.min(startY.value, currentY.value);
  const right = Math.max(startX.value, currentX.value);
  const bottom = Math.max(startY.value, currentY.value);

  const newSelection: string[] = [];

  desktopStore.icons.forEach(icon => {
    const iconLeft = icon.x;
    const iconTop = icon.y;
    const iconRight = iconLeft + 80;
    const iconBottom = iconTop + 90;

    const intersect = !(iconRight < left ||
                        iconLeft > right ||
                        iconBottom < top ||
                        iconTop > bottom);
    if (intersect) {
      newSelection.push(icon.id);
    }
  });

  desktopStore.setSelection(newSelection);
};
</script>

<style scoped lang="scss">
.desktop-environment {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.desktop-surface {
  position: relative;
  flex: 1;
  width: 100%;
  height: calc(100% - 48px);
  overflow: hidden;
}

.selection-box {
  position: absolute;
  border: 1px solid rgba(0, 120, 215, 0.5);
  background-color: rgba(0, 120, 215, 0.2);
  z-index: 50;
  pointer-events: none;
}

.context-menu {
  position: absolute;
  z-index: 9999;
  background: var(--os-menu-bg, rgba(30, 30, 30, 0.95));
  border: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
  border-radius: 8px;
  padding: 8px;
  min-width: 200px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}

.context-item {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: var(--os-text, #fff);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.start-menu-panel {
  position: absolute;
  bottom: 60px;
  left: 10px;
  z-index: 9999;
}

.fixed-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
