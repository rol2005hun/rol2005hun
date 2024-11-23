<template>
    <div class="desktop" id="desktop" @mousedown="startSelection" @mousemove="updateSelection" @mouseup="endSelection" :style="{ backgroundImage: `url(${backgroundUrl})` }">
        <div class="selection-box" v-if="isSelecting" :style="selectionBoxStyles"></div>
        <div class="desktop-background"></div>
        <div class="taskbar">
            <div class="start-button" @click="isMenuVisible = !isMenuVisible">
                <img src="public/images/ranzakOSstart.webp" alt="ranzakOSstart" class="start-img">
            </div>
            <StartMenu v-if="isMenuVisible" ref="startMenu" @openSysInfo="openApp($event)" />
            <div class="task-icons">
                <span v-for="app in apps.filter(app => app.desktopIcon || currentApps.some(current => current.id === app.id))" :key="app.id" 
                    :class="{ icon: true, active: currentApps.map(appid => appid.id).includes(app.id) }" @click="openApp(app.id)"> {{ app.icon }}
                </span>
            </div>
            <div class="task-time">
                <div class="hour">
                    <span>{{ hour }}</span>
                </div>
                <div class="date">
                    <span>{{ date }}</span>
                </div>
            </div>
            <RightClickMenu />
        </div>
        <div class="desktop-icons">
            <div v-for="app in apps.filter(app => app.desktopIcon)" :key="app.id" class="app" :class="app.id" @click="openApp(app.id)">
                <span class="icon">{{ app.icon }}</span>
                <span class="name">{{ app.name }}</span>
            </div>
        </div>
        <div v-for="app in currentApps" :key="app.id" class="window" :class="app.id" ref="window" :style="{ top: app.position.top + 'px', left: app.position.left + 'px', zIndex: app.zIndex }"
            v-show="apps.some(a => a.id === app.id)" @click="putToTop(app)">
            <div class="window-header" @mousedown="startDrag(app, $event)">
                <div class="icon-name">
                    <span class="window-icon">{{ apps.find(a => a.id === app.id)?.icon }}</span>
                    <span class="window-title">{{ appName(app.id) }}</span>
                </div>
                <div class="buttons">
                    <button class="minimize btn" @click="minimizeApp(app.id)">—</button>
                    <button class="maximize btn" @click="maximizeApp(app.id)">🗖</button>
                    <button class="close btn" @click="closeApp(app.id)">X</button>
                </div>
            </div>
            <component :is="getComponent(app.id)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import AppsAbout from '@/components/apps/About.vue';
import AppsTerminal from '@/components/apps/Terminal.vue';
import AppsMusicPlayer from '@/components/apps/MusicPlayer.vue';
import AppsWolimbySearch from '@/components/apps/WolimbySearch.vue';
import SystemInfo from '@/components/apps/SystemInfo.vue';
import Settings from '@/components/apps/Settings.vue';

const apps = ref([
    { id: 'about', name: 'Rólam', icon: '📂', desktopIcon: true, component: markRaw(AppsAbout) },
    { id: 'terminal', name: 'Terminal', icon: '💻', desktopIcon: true, component: markRaw(AppsTerminal) },
    { id: 'musicplayer', name: 'Zene', icon: '🎵', desktopIcon: true, component: markRaw(AppsMusicPlayer) },
    { id: 'browser', name: 'Wolimby Search', icon: '🌐', desktopIcon: true, component: markRaw(AppsWolimbySearch) },
    { id: 'sysinfo', name: 'ranzakOS v2 névjegye', icon: 'ℹ️', desktopIcon: false, component: markRaw(SystemInfo) },
    { id: 'settings', name: 'Beállítások', icon: '⚙️', desktopIcon: false, component: markRaw(Settings) }
]);
const currentApps = useCookie('currentApps', { default: () => [] }) as Ref<{ id: string, position: { top: number, left: number }, zIndex: number }[]>;
const startMenu = ref<HTMLElement | null>(null);
const backgroundUrl = useCookie('backgroundUrl', { expires: new Date('3000-12-12') }) as Ref<string>;
const isMenuVisible = ref(false);
const hour = ref(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
const date = ref(new Date().toLocaleDateString());
const isSelecting = ref(false);
const selectionStart = ref<{ x: number; y: number } | null>(null);
const selectionEnd = ref<{ x: number; y: number } | null>(null);
let zIndexCounter = 1000;

if (!currentApps.value || !Array.isArray(currentApps.value)) {
    currentApps.value = [];
}

function handleOutsideClick(event: MouseEvent) {
    const startMenuElement = document.querySelector('.start-menu');
    const startButton = document.querySelector('.start-button');

    if (
        startMenuElement &&
        !startMenuElement.contains(event.target as Node) &&
        startButton &&
        !startButton.contains(event.target as Node)
    ) {
        isMenuVisible.value = false;
    }
}

function openApp(appId: string) {
    const appExists = currentApps.value.find((app) => app.id === appId);
    if (!appExists) {
        const newApp = { id: appId, position: { top: 20, left: 125 }, zIndex: zIndexCounter++ };
        currentApps.value.push(newApp);
    } else {
        putToTop(appExists);
    }

    const cleanedIcons = new Set([...selectedIcons].map(icon => icon.split(' ')[0]));
    selectedIcons.clear();
    
    for (const icon of cleanedIcons) {
        openApp(icon);
    }
}

function minimizeApp(appId: string) {
    const app = document.querySelector(`.window.${appId}`) as HTMLElement;
    if (!app) return;

    app.style.width = '50%';
    app.style.height = '50%';
}

function maximizeApp(appId: string) {
    const appIndex = currentApps.value.findIndex((app) => app.id === appId);
    if (appIndex !== -1) {
        currentApps.value[appIndex] = { ...currentApps.value[appIndex], position: { top: 0, left: 0 } };
    }

    const app = document.querySelector(`.window.${appId}`) as HTMLElement;
    if (!app) return;

    app.style.width = '100%';
    app.style.height = '93%';
}

function closeApp(appId: string) {
    currentApps.value = currentApps.value.filter((app) => app.id !== appId);
}

function startDrag(app: { id: string; position: { top: number; left: number } }, event: MouseEvent) {
    const offset = {
        x: event.clientX - (app.position.left || 0),
        y: event.clientY - (app.position.top || 0),
    };

    const onDrag = (event: MouseEvent) => {
        let newTop = event.clientY - offset.y;
        let newLeft = event.clientX - offset.x;

        const windowElement = document.querySelector(`.window.${app.id}`) as HTMLElement;
        const headerElement = windowElement?.querySelector('.window-header') as HTMLElement;

        if (!windowElement || !headerElement) return;

        const headerHeight = headerElement.offsetHeight;
        const desktopWidth = window.innerWidth;
        const desktopHeight = window.innerHeight;
        const taskbarHeight = 70;
        const topBoundaryMargin = 42;
        const sideMargin = 45;

        newTop = Math.max(-headerHeight + topBoundaryMargin, Math.min(desktopHeight - taskbarHeight - headerHeight, newTop));
        newLeft = Math.max(-windowElement.offsetWidth + sideMargin, Math.min(desktopWidth - sideMargin, newLeft));

        app.position = { top: newTop, left: newLeft };

        const appIndex = currentApps.value.findIndex((a) => a.id === app.id);
        if (appIndex !== -1) {
            currentApps.value[appIndex] = { ...currentApps.value[appIndex], position: app.position };
        }
    };

    const stopDrag = () => {
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
}

function appName(appId: string): string {
    const app = apps.value.find((app) => app.id === appId);
    return app ? app.name : 'Ismeretlen alkalmazás';
}

function getComponent(appId: string) {
    const app = apps.value.find((app) => app.id === appId);
    return app ? app.component : null;
}

function putToTop(app: { id: string, zIndex: number }) {
    app.zIndex = zIndexCounter++;
}

let selectedIcons = new Set<string>();
    function startSelection(event: MouseEvent) {
    if (event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (target.closest('.window') || target.closest('.desktop-icons .app') || target.closest('.taskbar')) {
        return;
    }

    isSelecting.value = true;
    selectionStart.value = { x: event.clientX, y: event.clientY };
    selectionEnd.value = { x: event.clientX, y: event.clientY };
}

function updateSelection(event: MouseEvent) {
    if (!isSelecting.value || !selectionStart.value) return;

    selectionEnd.value = { x: event.clientX, y: event.clientY };

    const apps = document.querySelectorAll('.desktop-icons .app');
    apps.forEach((app) => {
        app.classList.remove('selected');
        const icon = app.querySelector('.icon');
        const name = app.querySelector('.name');
        if (icon) icon.classList.remove('selected');
        if (name) name.classList.remove('selected');
    });

    const selectionRect = {
        left: Math.min(selectionStart.value.x, selectionEnd.value.x),
        top: Math.min(selectionStart.value.y, selectionEnd.value.y),
        right: Math.max(selectionStart.value.x, selectionEnd.value.x),
        bottom: Math.max(selectionStart.value.y, selectionEnd.value.y),
    };

    apps.forEach((app) => {
        const rect = app.getBoundingClientRect();
        if (
            rect.left < selectionRect.right &&
            rect.right > selectionRect.left &&
            rect.top < selectionRect.bottom &&
            rect.bottom > selectionRect.top
        ) {
            app.classList.add('selected');
            
            const icon = app.querySelector('.icon');
            const name = app.querySelector('.name');
            if (icon) icon.classList.add('selected');
            if (name) name.classList.add('selected');

            selectedIcons.add(app.classList.value);
        }
    });
}


function endSelection(event: MouseEvent) {
    const clickedIcon = event.target as HTMLElement;
    const icons = document.querySelectorAll('.desktop-icons .app');

    if (!clickedIcon.classList.contains('selected')) {
        icons.forEach((icon) => {
            icon.classList.remove('selected');
            selectedIcons.clear();
        });
    }

    isSelecting.value = false;
    selectionStart.value = null;
    selectionEnd.value = null;
}

const selectionBoxStyles = computed(() => {
    if (!selectionStart.value || !selectionEnd.value) return {};

    const startX = Math.min(selectionStart.value.x, selectionEnd.value.x);
    const startY = Math.min(selectionStart.value.y, selectionEnd.value.y);
    const width = Math.abs(selectionEnd.value.x - selectionStart.value.x);
    const height = Math.abs(selectionEnd.value.y - selectionStart.value.y);

    return {
        left: `${startX}px`,
        top: `${startY}px`,
        width: `${width}px`,
        height: `${height}px`,
    };
});

onMounted(() => {
    document.addEventListener('click', handleOutsideClick);

    setInterval(() => {
        hour.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        date.value = new Date().toLocaleDateString();
    }, 1000);
});

onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/desktop.scss';
</style>
