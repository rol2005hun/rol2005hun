<template>
  <div class="games-app">
    <iframe
      src="https://play.wolimby.site"
      frameborder="0"
      class="games-iframe"
      allow="fullscreen"
      allowfullscreen></iframe>
  </div>
</template>

<script setup lang="ts">
// Wolimby Games App
</script>

<style scoped lang="scss">
.games-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--os-window-bg);
  overflow: hidden;
}

.games-iframe {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  background: #000; /* In case iframe takes time to load */
}
</style>
