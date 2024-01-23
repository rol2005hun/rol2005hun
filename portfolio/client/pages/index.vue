<template>
  <main class="index">
    <div class="divs">
      <div class="terminal">
        <span class="prompt big">ranzakOS v1.1 copyrighted</span>
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
import { ref, onMounted } from 'vue';
import functions from '@/assets/ts/functions';
import executeCommands from '@/assets/ts/commands';

const outputs = ref<string[]>([]);
const command = ref('christmascounter');
const username = ref(functions.getCookie('username') || 'you');

onMounted(() => {
  executeCommand();
});

function executeCommand() {
  if(!command.value) return outputs.value = [...outputs.value, `${username.value}@ranzak.me:~$`];
  let output = executeCommands(command.value);
  if(typeof output === 'object') {
    eval(output[0]);
    output = output[1];
  }
  outputs.value = [...outputs.value, `${username.value}@ranzak.me:~$ ${command.value}`, output];
  command.value = '';
  username.value = functions.getCookie('username') || 'you';
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/index.scss';
</style>