<template>
    <div class="desktop">
        <div class="desktop-background"></div>
        <div class="taskbar">
            <div class="start-button" @click="isMenuVisible = !isMenuVisible">
                <img src="public/images/ranzakOSstart.webp" alt="ranzakOSstart" class="start-img">
            </div>
            <StartMenu v-if="isMenuVisible" />
            <div class="task-icons">
                <span :class="{ icon: true, active: currentApp === 'about' }" @click="currentApp = 'about'">📂</span>
                <span :class="{ icon: true, active: currentApp === 'terminal' }" @click="currentApp = 'terminal'">💻</span>
                <span :class="{ icon: true, active: currentApp === 'musicplayer' }" @click="currentApp = 'musicplayer'">🎵</span>
            </div>
        </div>
        <div class="desktop-icons">
            <div class="app about" @click="currentApp = 'about'">
                <span class="icon">📂</span>
                <span class="name">Rólam</span>
            </div>
            <div class="app terminal" @click="currentApp = 'terminal'">
                <span class="icon">💻</span>
                <span class="name">Terminal</span>
            </div>
            <div class="app music" @click="currentApp = 'musicplayer'">
                <span class="icon">🎵</span>
                <span class="name">Zene</span>
            </div>
        </div>
        <div class="window" ref="window" :style="{ top: position.top + 'px', left: position.left + 'px' }" v-show="apps.includes(currentApp)">
            <div class="window-header" @mousedown="startDrag">
                <span class="window-title">{{ appName(currentApp) }}</span>
                <button class="close-btn" @click="closeApp">X</button>
            </div>
            <AppsAbout v-show="currentApp == 'about'" />
            <AppsTerminal v-show="currentApp == 'terminal'" />
            <AppsMusicPlayer v-show="currentApp == 'musicplayer'" />
        </div>
    </div>
</template>

<script setup lang="ts">
const currentApp = useCookie('currentApp') as Ref<string>;
const window = ref<HTMLDivElement | null>(null);
const position = ref({ top: 20, left: 125 }) as Ref<{ top: number, left: number }>;
let offset = { x: 0, y: 0 } as { x: number, y: number };
let isDragging = false as boolean;
const isMenuVisible = ref(false);
const apps = ref(['about', 'terminal', 'musicplayer']) as Ref<string[]>;

if (currentApp.value == undefined) currentApp.value = 'null';

function closeApp() {
    currentApp.value = 'null';
}

function startDrag(event: MouseEvent) {
    isDragging = true;
    offset = {
        x: event.clientX - (position.value.left || 0),
        y: event.clientY - (position.value.top || 0),
    };

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
}

function onDrag(event: MouseEvent) {
    if (!isDragging) return;
    position.value = {
        top: event.clientY - offset.y,
        left: event.clientX - offset.x,
    };
}

function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
}

function appName(app: string): string {
    switch (app) {
        case 'about':
            return 'Rólam';
        case 'terminal':
            return 'Terminal';
        case 'musicplayer':
            return 'Zene';
        default:
            return 'hát ennek nem kellene így lennie, szólj nekem kérlek, vmi nem kóser';
    }
}
</script>

<style scoped lang="scss">
@use '@/assets/components/scss/desktop.scss';
</style>