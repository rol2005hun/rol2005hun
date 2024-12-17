<template>
    <div class="app">
        <Login v-else-if="currentScreen === 'login'" @mousedown="startUnlock" @mouseup="cancelUnlock" @mouseleave="cancelUnlock" />
        <Loading v-else-if="currentScreen === 'loading'" />
        <Desktop v-else-if="currentScreen === 'desktop'" />
        <Logout v-else-if="currentScreen === 'logout'" />
        <NotFound v-else />
    </div>
</template>

<script setup lang="ts">
const acceptedCookies = useCookie('acceptedCookies', { expires: new Date('3000-12-12'), default: () => false }) as Ref<boolean>;
const currentScreen = useCookie('currentScreen', { default: () => 'login' }) as Ref<string>;
const unlockTimer = ref<ReturnType<typeof setTimeout> | null>(null);

function startUnlock() {
    unlockTimer.value = setTimeout(() => {
        currentScreen.value = 'loading';
    }, 2000);
}

function cancelUnlock() {
    if (unlockTimer.value) {
        clearTimeout(unlockTimer.value);
        unlockTimer.value = null;
    }
}
</script>
  
<style scoped lang="scss">
@use '@/assets/scss/index.scss';
</style>  
