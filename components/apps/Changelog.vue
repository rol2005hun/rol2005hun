<template>
    <div class="changelog">
        <h1>Changelog</h1>
        <ul>
            <li v-for="(log, index) in changelogs.changelogs.slice().reverse()" :key="index">
                <strong>{{ log.date }} {{ log.version }}</strong>: {{ log.name }}
                <p v-html="log.description"></p>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import changelogs from '@/public/jsons/changelogs.json';
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/apps/changelog.scss';
</style>