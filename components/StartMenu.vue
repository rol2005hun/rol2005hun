<template>
    <div class="start-menu">
        <div class="menu-items">
            <div class="menu-item" @click="$emit('openApp', 'sysinfo')">ranzakOS v2 névjegye</div>
            <div class="menu-item" @click="$emit('openApp', 'settings')">Beállítások</div>
            <div class="menu-item" @click="turnOff">Leállítás</div>
        </div>
    </div>
</template>

<script setup lang="ts">
const currentScreen = useCookie('currentScreen') as Ref<string>;

function turnOff() {
    currentScreen.value = 'logout';    
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/startmenu.scss';
</style>