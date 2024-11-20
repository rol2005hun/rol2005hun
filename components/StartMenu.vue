<template>
    <div class="start-menu">
        <div class="menu-items">
            <div class="menu-item">Programs</div>
            <div class="menu-item">Settings</div>
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
@use '@/assets/components/scss/startmenu.scss';
</style>