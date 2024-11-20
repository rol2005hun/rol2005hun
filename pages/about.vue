<template>
    <main class="about">
        <div class="content">
            <img src="/assets/img/me.webp" alt="pfp">
            <div class="content-left">
                <div class="personal">
                    <h2>Személyes információk</h2>
                    <h3>・<i class="fa-solid fa-house-chimney-window"></i> Románia, Hosszúmező</h3>
                    <h3>・<i class="fa-solid fa-school"></i> Leőwey Klára Elméleti Líceum</h3>
                    <h3>・<i class="fa-solid fa-building-columns"></i> Debreceni Egyetem Informatikai Kar</h3>
                    <h3>・<i class="fa-solid fa-cake-candles"></i> {{ age }} éves (2005.12.25)</h3>
                    <h3>・<i class="fa-solid fa-code"></i> 4+ év tapasztalat (ez a hobbim)</h3>
                    <h3>・<i class="fa-solid fa-language"></i> Beszélek még románul, angolul, németül és kicsit oroszul is</h3>
                </div>
                <div class="languages">
                    <h2>Ismert programozási nyelvek</h2>
                    <h3>・<i class="fa-brands fa-vuejs"></i> Frontend: HTML, Vue.js, Nuxt.js, Svelte.js</h3>
                    <h3>・<i class="fa-brands fa-js"></i> Backend: NodeJS</h3>
                    <h3>・<i class="fa-brands fa-java"></i> Java</h3>
                    <h3>・<i class="fa-brands fa-c"></i> C++</h3>
                    <h3>・<i class="fa-brands fa-python"></i> Python</h3>
                </div>
                <div class="socials">
                    <h2>Oldalaim</h2>
                    <h3>・<a href="https://discord.com/" class="link"><i class="fa-brands fa-discord"></i> Discord tag: harapalb.</a></h3>
                    <h3>・<a href="https://github.com/rol2005hun" class="link"><i class="fa-brands fa-github"></i> rol2005hun</a></h3>
                    <h3>・<a href="https://www.facebook.com/profile.php?id=100007575887372" class="link"><i class="fa-brands fa-facebook"></i> Ranyák Roland</a></h3>
                    <h3>・<a href="https://www.instagram.com/roland_ranyak11/" class="link"><i class="fa-brands fa-instagram"></i> roland_ranyak11</a></h3>
                    <h3>・<a href="mailto:contact@ranzak.site"><i class="fa-solid fa-envelope"></i> contact@ranzak.site</a></h3>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
const age = ref(0);

function calculateAge() {
    const birthDateObject = new Date('2005-12-25');
    const currentDate = new Date();
    age.value = currentDate.getFullYear() - birthDateObject.getFullYear();

    if (currentDate.getMonth() < birthDateObject.getMonth() || (currentDate.getMonth() === birthDateObject.getMonth() && currentDate.getDate() < birthDateObject.getDate())) {
        age.value--;
    }
}

calculateAge();
</script>

<style lang="scss" scoped>
@use '@/assets/scss/about.scss';
</style>