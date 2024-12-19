<template>
    <div class="loading-screen">
        <div class="loader"></div>
        <span>{{ currentText }}</span>
    </div>
</template>

<script setup lang="ts">
const currentScreen = useCookie('currentScreen') as Ref<string>;
const texts = ['Betöltés...', 'Felkészülés az indulásra...', 'Rendszer frissitése...', 'Üdvözöljük!'];
const currentText = ref(texts[0]);
const audioSrc = 'https://v1.cdnpk.net/videvo_files/audio/premium/audio0025/watermarked/AppleIiDiscDriveB PE1020501_preview.mp3';

onMounted(() => {
    const audio = new Audio(audioSrc);
    audio.play().catch((error) => {
        console.error('Hiba történt a hang lejátszása során: ', error);
    });

    let index = 0;
    const interval = setInterval(() => {
        index++;
        if (index < texts.length) {
            currentText.value = texts[index];
        } else {
            clearInterval(interval);
        }
    }, 1500);

    setTimeout(() => {
        currentScreen.value = 'desktop';
    }, 6000);
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/loading.scss';
</style>