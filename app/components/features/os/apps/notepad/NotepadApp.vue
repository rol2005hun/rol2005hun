<template>
  <div class="notepad-app">
    <div class="toolbar">
      <div class="toolbar-section">
        <button class="action-btn" @click="newFile">
          <Icon name="ph:file-plus-bold" />
          <span class="btn-text">{{ $t('os.apps.notepad.new') }}</span>
        </button>
      </div>
      <div class="toolbar-section">
        <button class="action-btn primary" @click="saveFile">
          <Icon name="ph:download-simple-bold" />
          <span class="btn-text">{{ $t('os.apps.notepad.save') }}</span>
        </button>
      </div>
    </div>

    <div class="editor-container">
      <textarea
        v-model="content"
        class="notepad-textarea"
        :placeholder="$t('os.apps.notepad.placeholder')"
        spellcheck="false"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const content = ref('');

const newFile = () => {
  if (
    content.value.trim() === '' ||
    confirm('Are you sure you want to create a new file? Unsaved changes will be lost.')
  ) {
    content.value = '';
  }
};

const saveFile = () => {
  const blob = new Blob([content.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'notes.txt';
  link.click();
  URL.revokeObjectURL(url);
};

onMounted(() => {
  // Focus logic can be added here if needed
});
</script>

<style scoped lang="scss">
.notepad-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--os-window-bg);
  color: var(--os-text, #fff);
  overflow: hidden;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: color-mix(in srgb, var(--os-window-bg) 80%, var(--os-border, #ccc));
  border-bottom: 1px solid var(--os-border, #333);
  gap: 15px;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: color-mix(in srgb, var(--os-text) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--os-border, #444) 50%, transparent);
  border-radius: 8px;
  color: var(--os-text);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: color-mix(in srgb, var(--os-text) 10%, transparent);
  }

  &.primary {
    background: #0078d4;
    color: white;
    border-color: #0078d4;

    &:hover {
      background: #006abc;
    }
  }

  .btn-text {
    display: none;
    @media (min-width: 400px) {
      display: inline;
    }
  }
}

.editor-container {
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.notepad-textarea {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  color: var(--os-text);
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 15px;
  line-height: 1.5;
  resize: none;
  outline: none;
  padding: 10px;
  box-sizing: border-box;

  &::placeholder {
    color: color-mix(in srgb, var(--os-text) 40%, transparent);
  }
}
</style>
