<template>
    <div class="right-click-menu" v-if="showMenu" :style="{ top: `${menuY}px`, left: `${menuX}px` }">
        <div class="start-menu">
            <div class="menu-items">
                <div class="menu-item" @click="currentApps = []; hideContextMenu">Appok bezárása</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const currentApps = useCookie('currentApps', { expires: new Date('3000-12-12') }) as Ref<{ id: string, position: { top: number, left: number }, zIndex: number }[]>;
const showMenu = ref(false);
const menuX = ref(0);
const menuY = ref(0);

function showContextMenu(event: MouseEvent) {
    event.preventDefault();
    showMenu.value = true;
    menuX.value = event.clientX;
    menuY.value = event.clientY;

    const windowWidth = window.innerWidth;
    const menuWidth = 130;
    if (menuX.value + menuWidth > windowWidth) {
        menuX.value -= menuWidth;
    }
}

function hideContextMenu(event: MouseEvent) {
    event.preventDefault();
    showMenu.value = false;
}


onMounted(() => {
    document.body.addEventListener('contextmenu', showContextMenu);
    document.body.addEventListener('click', hideContextMenu);
});

onBeforeUnmount(() => {
    document.body.removeEventListener('contextmenu', showContextMenu);
    document.body.removeEventListener('click', hideContextMenu);
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/components/rightclickmenu.scss';
</style>
