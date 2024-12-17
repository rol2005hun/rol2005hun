<template>
    <div class="system-info">
      <h1>Rendszer információk</h1>
        <ul>
            <li><strong>Felhasználói ágens:</strong> {{ userAgent }}</li>
            <li><strong>Platform:</strong> {{ platform }}</li>
            <li><strong>Processzor:</strong> {{ processor }}</li>
            <li><strong>OS Verzió:</strong> {{ os }}</li>
            <li><strong>Nyelv:</strong> {{ language }}</li>
            <li><strong>App Verzió:</strong> {{ appVersion }}</li>
        </ul>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const userAgent = ref<string>('');
const platform = ref<string>('');
const processor = ref<Number>()
const appVersion = ref<string>('');
const language = ref<string>('');
const os = ref<string>('ranzakOS v2');

onMounted(() => {   
    userAgent.value = navigator.userAgent;
    platform.value = navigator.platform;
    processor.value = window.navigator.hardwareConcurrency;
    appVersion.value = navigator.appVersion;
    language.value = navigator.language
});
</script>
  
<style scoped lang="scss">
@use '@/assets/scss/components/apps/systeminfo.scss';
</style>