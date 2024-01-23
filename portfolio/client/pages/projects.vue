<template>
    <main class="projects">
        <div class="project" v-for="project in projects" :key="project.id">
            <img class="project-profile-img" :src="project.background" alt="">
            <div class="project-description-bk"></div>
            <div class="project-logo">
                <img :src="project.logo" alt="">
            </div>
            <div class="project-description">
                <p v-html="project.description"></p>
            </div>
            <div class="project-footer">
                <p v-html="project.footer"></p>
            </div>
            <div class="project-btn">
                <a :href="project.redirect" target="_blank">Lássuk</a>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import projects from '@/assets/ts/projects.json';
</script>

<style lang="scss" scoped>
@import '@/assets/scss/projects.scss';
</style>