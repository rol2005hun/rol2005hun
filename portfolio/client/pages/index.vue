<template>
    <main class="index">
      <div class="divs">
        <div class="terminal" ref="terminalRef">
          <span class="prompt big">ranzakOS v1.3 copyrighted</span>
          <div class="output" v-for="output in outputs" v-html="output"></div>
          <div class="input-container">
            <span class="prompt">{{ username }}@ranzak.me:~$</span>
            <input v-model="command" @keyup.enter="executeCommand" placeholder="Futass le egy parancsot..." />
          </div>
        </div>
      </div>
    </main>
</template>

<script setup lang="ts">
import functions from '@/composables/functions';
import executeCommands from '@/composables/commands';

const outputs = ref<string[]>([]);
const command = ref('info');
const username = ref(functions.getCookie('username') || 'you');
const terminalRef = ref<HTMLElement>();

function executeCommand() {
    if(!command.value) return outputs.value = [...outputs.value, `${username.value}@ranzak.me:~$`];
    let output = executeCommands(command.value);
    outputs.value = [...outputs.value, `${username.value}@ranzak.me:~$ ${command.value}`, output];
    command.value = '';
    username.value = functions.getCookie('username') || 'you';
    nextTick(() => {
        if (terminalRef.value) {
        terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
        }
    });
}

executeCommand();
</script>

<style lang="scss" scoped>
@use '@/assets/scss/index.scss';
</style>