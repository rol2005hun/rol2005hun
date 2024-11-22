<template>
    <div class="loading-page">
        <div class="loading-content">
            <div class="fingerprint-scanner" @mousedown="startUnlock" @mouseup="cancelUnlock" @mouseleave="cancelUnlock">
                <div v-if="isUnlocking" class="scanning-animation"></div>
            </div>
            <span class="label">Tartsd rajta az ujjad a bejelentkezéshez</span>
        </div>
    </div>
</template>

<script setup lang="ts">
const isUnlocking = ref(false);

function startUnlock() {
    isUnlocking.value = true;
}

function cancelUnlock() {
    isUnlocking.value = false;
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/login.scss';
</style>