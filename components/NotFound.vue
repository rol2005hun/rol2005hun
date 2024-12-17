<template>
    <div class="kernel-panic">
        <h1>kernel panic</h1>
        <p>A fatal error has occurred. The system has been halted.</p>
        <pre>
            <code>
                Kernel panic - not syncing: Attempted to kill init! exitcode=0x00000009
                CPU: 0 PID: 1 Comm: init Not tainted 5.4.0-42-generic #46-Ubuntu
                Hardware name: Example Hardware
                Call Trace:
                 dump_stack+0x66/0x81
                 panic+0x101/0x2e3
                 do_exit+0xb24/0xb30
                 do_group_exit+0x47/0xb0
                 __x64_sys_exit_group+0x18/0x20
                 do_syscall_64+0x57/0x190
                 entry_SYSCALL_64_after_hwframe+0x44/0xa9
            </code>
        </pre>
        <p>retarting after {{ seconds }} seconds</p>
    </div>
</template>

<script setup lang="ts">
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