<template>
  <div class="app-container terminal-app" @click="focusInput">
    <div class="output">
      <div v-for="(line, i) in history" :key="i" class="line">{{ line }}</div>
    </div>
    <div class="input-line">
      <span class="prompt">guest@ranzakOS:~$</span>
      <input
        ref="cmdInput"
        v-model="command"
        type="text"
        spellcheck="false"
        autocomplete="off"
        @keyup.enter="execute"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const history = ref<string[]>(['ranzakOS Terminal v1.0.0', 'Type "help" for a list of available commands.']);
const command = ref('');
const cmdInput = ref<HTMLInputElement | null>(null);

const focusInput = () => {
  cmdInput.value?.focus();
};

const execute = () => {
  const cmd = command.value.trim();
  if (cmd) {
    history.value.push(`guest@ranzakOS:~$ ${cmd}`);
    if (cmd === 'help') history.value.push('Available commands: help, echo, clear, date');
    else if (cmd === 'clear') history.value = [];
    else if (cmd === 'date') history.value.push(new Date().toString());
    else if (cmd.startsWith('echo ')) history.value.push(cmd.substring(5));
    else history.value.push(`Command not found: ${cmd}`);
  }
  command.value = '';
};
</script>

<style scoped>
.terminal-app {
  height: 100%;
  background: #000;
  color: #0f0;
  font-family: monospace;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
}
.line, .input-line {
  line-height: 1.4;
  font-size: 14px;
}
.input-line {
  display: flex;
}
.prompt {
  margin-right: 8px;
}
input {
  background: transparent;
  border: none;
  color: #0f0;
  font-family: monospace;
  font-size: 14px;
  flex: 1;
  outline: none;
}
</style>
