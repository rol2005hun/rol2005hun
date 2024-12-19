<template>
    <div class="kernel-panic">
        <h1>kernel panic</h1>
        <p>A fatal error has occurred. The system has been halted.</p>
        <span class="code">
            <p>Kernel panic - not syncing: Attempted to kill init! exitcode=0x00000009</p>
            <p>CPU: 0 PID: 1 Comm: init Not tainted 5.4.0-42-generic #46-Ubuntu</p>
            <p>Hardware name: ranzakOSv2 hardwares</p>
            <p>!!! PLEASE CONTACT THE SYSTEM ADMINISTRATOR, WITH A SCREENSHOT: RANZAK !!!</p>
            <p>Error statuscode: <span style="color: red;">{{ error?.statusCode }}</span></p>
            <p>Error message: <span style="color: red;">{{ error?.cause }}</span></p>
            <p>Error JSON: <span style="color: red;">{{ error?.toJSON }}</span></p>
        </span>
        <p>retarting after {{ seconds }} seconds</p>
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
  error: Object as () => NuxtError
});
const currentScreen = useCookie('currentScreen') as Ref<string>;
const seconds = ref(10);

function restart() {
    const countdown = setInterval(() => {
        if (seconds.value > 1) {
            seconds.value--;
        } else {
            clearInterval(countdown);
        }
    }, 1000);
    setTimeout(() => {
        navigateTo('/');
        currentScreen.value = 'loading';
    }, 10000);
}

onMounted(() => {
    restart();
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/notfound.scss';
</style>