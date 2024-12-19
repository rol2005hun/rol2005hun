<template>
    <div class="settings">
        <h1>Beállítások</h1>
        <section>
            <h2>Háttérkép</h2>
            <div class="background-settings">
                <label for="background-url">Link megadása:</label>
                <input id="background-url" type="text" v-model="backgroundUrl" placeholder="Háttérkép URL..." />
            </div>
        </section>
        <section>
            <h2>Terminál felhasználónév</h2>
            <label for="terminal-username">Felhasználónév:</label>
            <input id="terminal-username" type="text" v-model="terminalUsername" placeholder="Terminál név..." />
        </section>
        <button @click="openApp('changelog')">Újdonságok</button>
    </div>
</template>


<script setup lang="ts">
const { openApp } = useDesktop();
const backgroundUrl = useCookie('backgroundUrl', { expires: new Date('3000-12-12') }) as Ref<string>;
const terminalUsername = useCookie('username', { expires: new Date('3000-12-12') }) as Ref<string>;
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/apps/settings.scss';
</style>