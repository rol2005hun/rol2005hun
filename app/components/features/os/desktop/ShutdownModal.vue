<template>
  <div class="shutdown-modal-overlay">
    <div class="shutdown-modal">
      <div class="modal-icon">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
      </div>
      <h2>Biztos le akarja kapcsolni a gépet?</h2>
      <p>Minden nem mentett adat elvész, és az ablak bezárul.</p>

      <div class="modal-actions">
        <button class="btn-cancel" @click="systemStore.cancelShutdown">Mégse</button>
        <button class="btn-confirm" @click="systemStore.confirmShutdown">Leállítás</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSystemStore } from '~/stores/features/os/useSystemStore';

const systemStore = useSystemStore();
</script>

<style scoped lang="scss">
.shutdown-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.shutdown-modal {
  background-color: var(--os-window-bg);
  border: 1px solid var(--os-border-color);
  border-radius: 8px;
  padding: 32px;
  width: 400px;
  max-width: 90%;
  text-align: center;
  color: var(--os-text);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  animation: modal-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-icon {
  color: #ff3b30;
  margin-bottom: 16px;
}

h2 {
  font-size: 20px;
  margin-bottom: 8px;
  font-weight: 500;
}

p {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

button {
  padding: 8px 24px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-cancel {
  background-color: transparent;
  color: var(--os-text);
  border: 1px solid var(--os-border-color);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.btn-confirm {
  background-color: #ff3b30;
  color: white;

  &:hover {
    background-color: #ff1a10;
  }
}

@keyframes modal-pop {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
