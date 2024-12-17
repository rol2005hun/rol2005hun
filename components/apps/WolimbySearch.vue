<template>
    <div class="browser">
        <div class="browser-header">
            <button class="nav-button" @click="goBack" :disabled="!canGoBack"><i class="fa-solid fa-arrow-left"></i></button>
            <button class="nav-button" @click="goForward" :disabled="!canGoForward"><i class="fa-solid fa-arrow-right"></i></button>
            <input type="text" class="address-bar" v-model="url" @keyup.enter="loadUrl" placeholder="Írj be egy URL-t, vagy keress rá valamire." />
        </div>
        <div class="browser-content">
            <iframe :src="iframeUrl" class="iframe-content"></iframe>
        </div>
    </div>
</template>

<script setup lang="ts">
const url = ref('https://chrcountback.netlify.app/');
const iframeUrl = ref('https://chrcountback.netlify.app/');
const canGoBack = ref(false);
const canGoForward = ref(false);
const openedLinks = ref<string[]>(['https://chrcountback.netlify.app/']);
const previousUrl = ref<string>(url.value);
let currentIndex = 0 as number;

function loadUrl() {
    if (url.value !== previousUrl.value) {
        previousUrl.value = url.value;

        if (url.value.match(/^(http|https):\/\//)) {
            iframeUrl.value = url.value;

            openedLinks.value.push(url.value);
            currentIndex++;
            canGoBack.value = true;
        } else if (url.value.trim()) {
            iframeUrl.value = `https://askvoid.com/search?q=${encodeURIComponent(url.value)}`;
            url.value = iframeUrl.value;

            openedLinks.value.push(iframeUrl.value);
            currentIndex++;
            canGoBack.value = true;
        } else {
            iframeUrl.value = 'https://askvoid.com/';
        }
    }
}

function goBack() {
    currentIndex--;
    canGoForward.value = true;
    if (currentIndex === 0) canGoBack.value = false;

    url.value = openedLinks.value[currentIndex];
    if (url.value.match(/^(http|https):\/\//)) {
        iframeUrl.value = url.value;
    } else {
        iframeUrl.value = `https://askvoid.com/search?q=${encodeURIComponent(url.value)}`;
    }
}

function goForward() {
    currentIndex++;
    canGoBack.value = true;
    if (currentIndex === openedLinks.value.length - 1) canGoForward.value = false;

    url.value = openedLinks.value[currentIndex];
    if (url.value.match(/^(http|https):\/\//)) {
        iframeUrl.value = url.value;
    } else {
        iframeUrl.value = `https://askvoid.com/search?q=${encodeURIComponent(url.value)}`;
    }
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/apps/wolimbysearch.scss'
</style>