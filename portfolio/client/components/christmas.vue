<template>
    <section v-if="showSnow" class="snow">
        <div class="snow1"></div>
        <div class="snow2"></div>
        <div class="snow3"></div>
    </section>
</template>

<script setup lang="ts">
import functions from '@/assets/ts/functions';

const snow = ref(functions.getCookie('showSnow') as any);
const { showSnow } = useChristmasUtils();

if(snow.value != undefined) showSnow.value = snow.value.toString() == 'true';

watch(showSnow, () => {
    functions.setCookie('showSnow', showSnow.value.toString(), 365);
});
</script>
    
<style lang="scss">
@import '@/assets/scss/christmas.scss';
</style>
  