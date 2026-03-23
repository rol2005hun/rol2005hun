<template>
  <div class="shutdown-modal-overlay" @click.stop.prevent @contextmenu.stop.prevent>
    <div class="shutdown-modal" @click.stop>
      <div class="modal-icon">
        <svg
          viewBox="0 0 24 24"
          width="36"
          height="36"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
          <line x1="12" y1="2" x2="12" y2="12" />
        </svg>
      </div>
      <h2>{{ $t('os.shutdownModal.title') }}</h2>
      <p>{{ $t('os.shutdownModal.description') }}</p>

      <div class="modal-actions">
        <button class="btn-cancel" @click="systemStore.cancelShutdown">
          {{ $t('os.shutdownModal.cancel') }}
        </button>
        <button class="btn-confirm" @click="systemStore.confirmShutdown">
          {{ $t('os.shutdownModal.confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSystemStore } from '@/stores/features/os/useSystemStore';

const systemStore = useSystemStore();
</script>

<style scoped lang="scss">
.shutdown-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.shutdown-modal {
  background-color: var(--os-window-bg);
  border: 1px solid var(--os-border-color);
  border-radius: 16px;
  padding: 36px 40px;
  width: 420px;
  max-width: 90%;
  text-align: center;
  color: var(--os-text);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  animation: modal-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-icon {
  color: #ff453a;
  background: rgba(255, 69, 58, 0.12);
  width: 76px;
  height: 76px;
  margin: 0 auto 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px rgba(255, 69, 58, 0.2);
}

h2 {
  font-size: 22px;
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

p {
  font-size: 15px;
  color: var(--os-text);
  opacity: 0.7;
  margin-bottom: 32px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

button {
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.btn-cancel {
  background-color: rgba(128, 128, 128, 0.05);
  color: var(--os-text);
  border: 1px solid var(--os-border-color);

  &:hover {
    background-color: rgba(128, 128, 128, 0.15);
  }

  &:active {
    background-color: rgba(128, 128, 128, 0.2);
  }
}

.btn-confirm {
  background-color: #ff453a;
  color: white;
  border: 1px solid #ff453a;
  box-shadow: 0 4px 12px rgba(255, 69, 58, 0.3);

  &:hover {
    background-color: #ff5147;
    border-color: #ff5147;
    box-shadow: 0 6px 16px rgba(255, 69, 58, 0.4);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(255, 69, 58, 0.3);
  }
}

@keyframes modal-pop {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
