<template>
    <div class="loading-screen">
        <div class="loader"></div>
        <span>{{ currentText }}</span>
    </div>
</template>

<script setup lang="ts">
const currentScreen = useCookie('currentScreen') as Ref<string>;
const texts = ['Kijelentkezés...', 'Programok bezárása...', 'Ideiglenes fájlok törlése...', 'Viszlát!'];
const currentText = ref(texts[0]);

onMounted(() => {
    setTimeout(() => {
        currentScreen.value = 'login';
    }, 6000);

    let index = 0;
    const interval = setInterval(() => {
        index++;
        if (index < texts.length) {
            currentText.value = texts[index];
        } else {
            clearInterval(interval);
        }
    }, 1500);
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/loading.scss';
</style>