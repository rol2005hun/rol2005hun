<template>
  <div class="app-container">
    <div class="toolbar">
      <input type="text" v-model="url" placeholder="https://..." />
      <button>Go</button>
    </div>
    <div class="content">
      <p>Browser content goes here</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const url = ref('https://ranzak.github.io');
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: var(--os-text, #fff);
  background: #1e1e1e;
}
.toolbar {
  display: flex;
  padding: 8px;
  background: rgba(0,0,0,0.5);
  gap: 8px;
}
.toolbar input {
  flex: 1;
  padding: 4px 8px;
  border-radius: 4px;
}
.content {
  flex: 1;
  padding: 20px;
}
</style>
