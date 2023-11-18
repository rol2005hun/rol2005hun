<template>
    <section class="snow">
        <div class="snow1"></div>
        <div class="snow2"></div>
        <div class="snow3"></div>
    </section>
    <button class="snowflake-button" @click="toggleSnow">❆</button>
</template>

<script setup lang="ts">
const showSnow = ref(true);

function toggleSnow() {
    const section = document.querySelector('section.snow') as HTMLElement;
    if(showSnow.value) {
        section.style.display = 'none';
    } else {
        section.style.display = 'block';
    }
    showSnow.value = !showSnow.value;
}
</script>
    
<style lang="scss">
@import '@/assets/scss/christmas.scss';
</style>
  