<template>
  <div class="desktop-environment" @click.self="desktopStore.closeStartMenu()">

    <div class="desktop-surface" @click.self="desktopStore.closeStartMenu()">
      <DesktopIcon
        v-for="icon in desktopStore.icons"
        :key="icon.id"
        :icon="icon"
      />

      <WindowFrame
        v-for="win in windowStore.windows"
        :key="win.id"
        :window-info="win"
      />
    </div>

    <Transition name="slide-up">
      <StartMenu v-if="desktopStore.isStartMenuOpen" class="start-menu-panel" />
    </Transition>

    <Taskbar class="fixed-bottom" />
  </div>
</template>

<script setup lang="ts">
import Taskbar from '~/components/features/os/taskbar/Taskbar.vue';
import StartMenu from '~/components/features/os/desktop/StartMenu.vue';
import WindowFrame from '~/components/features/os/window/WindowFrame.vue';
import DesktopIcon from '~/components/features/desktop/DesktopIcon.vue';
import { useDesktopStore } from '~/stores/features/os/useDesktopStore';
import { useWindowStore } from '~/stores/features/os/useWindowStore';

const desktopStore = useDesktopStore();
const windowStore = useWindowStore();
</script>

<style scoped lang="scss">
.desktop-environment {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
}

.desktop-surface {
  position: relative;
  flex: 1;
  width: 100%;
  height: calc(100% - 48px);
  overflow: hidden;
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
