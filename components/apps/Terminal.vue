<template>
    <div class="terminal" ref="terminalRef">
        <span class="prompt big">ranzakOS v2 terminal copyrighted</span>
        <div class="output" v-for="output in outputs" v-html="output"></div>
        <div class="input-container">
            <span class="prompt">{{ host }}</span>
            <input v-model="command" @keyup.enter="executeCommand" placeholder="Futass le egy parancsot..." />
        </div>
    </div>
</template>

<script setup lang="ts">
const { executeCommands } = useCommands();
const outputs = ref<string[]>([]);
const command = ref('info');
const username = useCookie('username', { expires: new Date('3000-12-12'), default: () => 'user' }) as Ref<string>;
const terminalRef = ref<HTMLElement>();
const host = ref(username.value + '@ranzak.site:~$');

function executeCommand() {
    if (!command.value) return outputs.value = [...outputs.value, `${host.value}`];
    let output = String(executeCommands(command.value));
    outputs.value = [...outputs.value, `${host.value} ${command.value}`, output];
    command.value = '';
    nextTick(() => {
        if (terminalRef.value) {
            terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
        }
    });
}

executeCommand();
</script>

<style scoped lang="scss">
@use '@/assets//scss/components/apps/terminal.scss';
</style>