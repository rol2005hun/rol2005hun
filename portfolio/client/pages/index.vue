<template>
    <div class="alive-container">
        <p class="alive-text">{{ aliveText }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const aliveText = ref('If you see this, you\'re probably alive.');

const aliveTextWithAnimation = computed(() => {
    const text = aliveText.value.split(' ');
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += text[i].split('').reduce((acc, cur) => {
            acc += cur;
            return acc + ' -> ' + acc;
        }, '');
        result += ' ';
    }
    return result.trim();
});
</script>

<style lang="scss">
@import '@/assets/scss/index.scss';
</style>
