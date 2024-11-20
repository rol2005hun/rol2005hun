<template>
    <div class="window-body">
        <div class="profile-picture">
            <img src="https://web.unideb.hu/rol2005hun/kep/MDI_4541.jpg" alt="pfp">
        </div>
        <div class="content">
            <p><strong>Név:</strong> Ranyák Roland</p>
            <p title="2005.12.25"><strong>Életkor:</strong> {{ calculateAge }}</p>
            <p><strong>Iskola:</strong> Leöwey Klára Elméleti Líceum</p>
            <p><strong>Egyetem:</strong> Debreceni Egyetem Informatikai Kar</p>
            <p><strong>Erősítem:</strong> 🇭🇺#Team Hungary</p>
            <h1>Elérhetőségek</h1>
            <ul>
                <li>・<a href="https://www.instagram.com/roland_ranyak11/" class="link"><i class="fa-brands fa-instagram"></i> roland_ranyak11</a></li>
                <li>・<a href="mailto:contact@ranzak.site"><i class="fa-solid fa-envelope"></i> contact@ranzak.site</a></li>
                <li>・<a href="https://discord.com/" class="link"><i class="fa-brands fa-discord"></i> harapalb.</a></li>
                <li>・<a href="https://github.com/rol2005hun" class="link"><i class="fa-brands fa-github"></i> rol2005hun</a></li>
            </ul>
            <h1>Skillek</h1>
            <ul>
                <li>・<i class="fa-brands fa-vuejs"></i> Frontend: HTML, Vue.js, Nuxt.js, Svelte.js</li>
                <li>・<i class="fa-brands fa-js"></i> Backend: NodeJS</li>
                <li>・<i class="fa-brands fa-java"></i> Java</li>
                <li>・<i class="fa-brands fa-c"></i> C++</li>
                <li>・<i class="fa-brands fa-python"></i> Python</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
const calculateAge = computed(() => {
    const birthDate = new Date('2005-12-25');
    const currentDate = new Date();
    const diff = currentDate.getTime() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});
</script>

<style scoped lang="scss">
@use '@/assets/components/scss/about.scss';
</style>