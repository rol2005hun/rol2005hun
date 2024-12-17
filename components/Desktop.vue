<template>
    <div class="desktop" id="desktop" @mousedown="startSelection" @mousemove="updateSelection" @mouseup="endSelection" :style="{ backgroundImage: `url(${backgroundUrl})` }">
        <div class="selection-box" v-if="isSelecting" :style="selectionBoxStyles"></div>
        <div class="desktop-background"></div>
        <div class="taskbar">
            <div class="start-button" @click="isMenuVisible = !isMenuVisible">
                <img src="public/images/ranzakOSstart.webp" alt="ranzakOSstart" class="start-img">
            </div>
            <StartMenu v-if="isMenuVisible" @openApp="openApp($event)" />
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
        <TransitionGroup name="window-transition" tag="div">
            <div v-for="app in currentApps" :key="app.id" :class="['window', app.id]" :style="{ zIndex: app.zIndex, top: app.position.top + 'px', left: app.position.left + 'px', 
                width: app.size.width + '%', height: app.size.height + '%' }" @mousedown="putToTop(app)">
                <div class="window-header" @mousedown="startDrag(app, $event)">
                    <div class="icon-name">
                        <span class="window-icon">{{ apps.find(a => a.id === app.id)?.icon }}</span>
                        <span class="window-title">{{ appName(app.id) }}</span>
                    </div>
                    <div class="buttons">
                        <button class="minimize btn" @click="minimizeApp(app.id)">—</button>
                        <button class="maximize btn" @click="maximizeApp(app.id)">
                            <span v-if="!maximized(app.id)">🗖</span>
                            <span v-else>
                                <span class="span-foreground">🗖</span>
                                <span class="span-background">🗖</span>
                            </span>
                        </button>
                        <button class="close btn" @click="closeApp(app.id)">X</button>
                    </div>
                </div>
                <component :is="getComponent(app.id)" />
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
const { apps, currentApps, backgroundUrl, isMenuVisible, hour, date, isSelecting, selectionBoxStyles, maximized, startSelection, updateSelection, endSelection, handleOutsideClick,
observeResize, openApp, minimizeApp, maximizeApp, closeApp, startDrag, appName, getComponent, putToTop } = useDesktop();

// karacsonyig
// karacsonyig vege

onMounted(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('mousemove', updateSelection);
    document.addEventListener('mouseup', endSelection);

    currentApps.value.forEach(app => {
        nextTick(() => observeResize(app.id));
    })
});

onUnmounted(() => {
    document.removeEventListener('mousedown', handleOutsideClick);
    document.removeEventListener('mousemove', updateSelection);
    document.removeEventListener('mouseup', endSelection);
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/desktop.scss';
</style>
