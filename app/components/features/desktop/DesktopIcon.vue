<template>
  <div
    class="desktop-icon"
    :style="{
      transform: `translate(${icon.x}px, ${icon.y}px)`
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppIcon from '~/components/features/os/shared/AppIcon.vue';
import { useAppRegistry } from '~/stores/features/os/useAppRegistry';
import { useWindowStore } from '~/stores/features/os/useWindowStore';
import { useDesktopStore, type DesktopIconItem } from '~/stores/features/os/useDesktopStore';

const props = defineProps<{
  icon: DesktopIconItem;
}>();

const { t } = useI18n();
const appRegistry = useAppRegistry();
const windowStore = useWindowStore();
const desktopStore = useDesktopStore();

const appMeta = computed(() => appRegistry.installedApps.find((app: any) => app.id === props.icon.appId));

let startX = 0;
let startY = 0;
let baseIconX = 0;
let baseIconY = 0;

const onMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  startX = e.clientX;
  startY = e.clientY;
  baseIconX = props.icon.x;
  baseIconY = props.icon.y;

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = (e: MouseEvent) => {
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  let newX = baseIconX + dx;
  let newY = baseIconY + dy;

  newX = Math.max(0, newX);
  newY = Math.max(0, newY);

  desktopStore.updateIconPosition(props.icon.id, newX, newY);
};

const onMouseUp = () => {
  // 100x100 rács (grid), 20px margóval
  const col = Math.round((props.icon.x - 20) / 100);
  const row = Math.round((props.icon.y - 20) / 100);

  const finalX = Math.max(0, col) * 100 + 20;
  const finalY = Math.max(0, row) * 100 + 20;

  desktopStore.updateIconPosition(props.icon.id, finalX, finalY);

  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};

const openApp = () => {
  if (appMeta.value) {
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
