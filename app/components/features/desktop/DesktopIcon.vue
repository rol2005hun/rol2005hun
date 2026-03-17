<template>
  <div
    class="desktop-icon"
    :class="{ 'is-dragging': isDragging, 'is-selected': isSelected }"
    :style="{
      transform: `translate(${isDragging ? dragX : icon.x}px, ${isDragging ? dragY : icon.y}px)`,
      zIndex: isDragging ? 100 : 1
    }"
    @mousedown="onMouseDown"
    @dblclick="openApp"
  >
    <div class="icon-image">
      <AppIcon :app-id="appMeta?.id || icon.appId" size="32px" />
    </div>
    <div class="icon-label">{{ t(appMeta?.nameKey || 'os.apps.' + icon.appId + '.name') }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppIcon from '~/components/features/os/shared/AppIcon.vue';
import { useAppRegistry } from '~/stores/features/os/useAppRegistry';
import { useWindowStore } from '~/stores/features/os/useWindowStore';
import { useDesktopStore, type DesktopIconItem } from '~/stores/features/os/useDesktopStore';

const props = defineProps<{
  icon: DesktopIconItem;
  isSelected?: boolean;
}>();

const { t } = useI18n();
const appRegistry = useAppRegistry();
const windowStore = useWindowStore();
const desktopStore = useDesktopStore();

const appMeta = computed(() => appRegistry.installedApps.find((app: any) => app.id === props.icon.appId));

const isDragging = ref(false);
const dragX = ref(0);
const dragY = ref(0);

let startX = 0;
let startY = 0;
let baseIconX = 0;
let baseIconY = 0;

const onMouseDown = (e: MouseEvent) => {
  if (e.button !== 0) return;
  e.preventDefault();

  if (!desktopStore.selectedIcons.includes(props.icon.id) || e.ctrlKey) {
    desktopStore.selectIcon(props.icon.id, e.ctrlKey);
  }

  startX = e.clientX;
  startY = e.clientY;
  baseIconX = props.icon.x;
  baseIconY = props.icon.y;

  isDragging.value = true;
  dragX.value = baseIconX;
  dragY.value = baseIconY;

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  dragX.value = Math.max(0, baseIconX + dx);
  dragY.value = Math.max(0, baseIconY + dy);
};

const onMouseUp = () => {
  if (!isDragging.value) return;
  const col = Math.round((dragX.value - 20) / 100);
  const row = Math.round((dragY.value - 20) / 100);

  let finalX = Math.max(0, col) * 100 + 20;
  let finalY = Math.max(0, row) * 100 + 20;

  const isOccupied = desktopStore.icons.some(
    (i) => i.id !== props.icon.id && i.x === finalX && i.y === finalY
  );

  if (isOccupied) {
    finalX = baseIconX;
    finalY = baseIconY;
  }

  desktopStore.updateIconPosition(props.icon.id, finalX, finalY);

  isDragging.value = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};

const openApp = () => {
  const selectedIds = desktopStore.selectedIcons;

  if (selectedIds.includes(props.icon.id) && selectedIds.length > 0) {
    selectedIds.forEach((id, index) => {
      const iconItem = desktopStore.icons.find(i => i.id === id);
      if (iconItem) {
        const meta = appRegistry.installedApps.find((app: any) => app.id === iconItem.appId);
        if (meta) {
          setTimeout(() => {
            windowStore.openWindow({
              id: `${meta.id}-${Date.now()}-${index}`,
              appId: meta.id,
              titleKey: meta.nameKey,
              width: meta.defaultWidth || 800,
              height: meta.defaultHeight || 600
            });
          }, index * 50);
        }
      }
    });
  } else if (appMeta.value) {
    windowStore.openWindow({
      id: `${appMeta.value.id}-${Date.now()}`,
      appId: appMeta.value.id,
      titleKey: appMeta.value.nameKey,
      width: appMeta.value.defaultWidth || 800,
      height: appMeta.value.defaultHeight || 600
    });
  }
};
</script>

<style scoped lang="scss">
.desktop-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.is-selected {
    background-color: rgba(0, 120, 215, 0.4);
    border: 1px solid rgba(0, 120, 215, 0.6);
  }

  .icon-image {
    width: 48px;
    height: 48px;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 4px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .icon-label {
    text-align: center;
    color: white;
    font-size: 12px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    word-break: break-word;
    max-width: 100%;
    line-height: 1.2;
    padding: 0 4px;
  }
}
</style>
