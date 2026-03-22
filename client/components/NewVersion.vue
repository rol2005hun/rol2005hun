<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h2>Ez a verzió már nem támogatott</h2>
      <p>Az oldal ezen verziója elavult és a továbbiakban nem frissül. Kérjük, látogass el az új weboldalra a legfrissebb funkciók eléréséhez.</p>
      <a href="https://ranzak.dev" class="btn-primary">Tovább az új verzióra</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isVisible = ref(false);

onMounted(() => {
  isVisible.value = true;
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: #ffffff;
  padding: 40px;
  border-radius: 8px;
  text-align: center;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

h2 {
  margin-top: 0;
  color: #222222;
  font-family: sans-serif;
}

p {
  color: #555555;
  margin-bottom: 25px;
  font-family: sans-serif;
  line-height: 1.5;
}

.btn-primary {
  display: inline-block;
  background-color: #007bff;
  color: #ffffff;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  font-family: sans-serif;
  transition: background-color 0.2s ease-in-out;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
