<template>
  <div ref="terminalContainer" class="app-container terminal-app" @click="focusInput">
    <div class="output">
      <div v-for="(line, i) in history" :key="i" class="line">
        <span v-if="line.prompt" class="prompt">{{ line.prompt }}</span>
        <span class="content">
          <template v-for="(part, j) in line.content.split('\n')" :key="j">
            {{ part }}
            <br v-if="j < line.content.split('\n').length - 1" />
          </template>
        </span>
      </div>
    </div>
    <div class="input-line">
      <span class="prompt">{{ promptText }}</span>
      <input
        ref="cmdInput"
        v-model="command"
        :type="isMaskedMode ? 'password' : 'text'"
        spellcheck="false"
        autocomplete="off"
        @keyup.enter="handleEnter" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TerminalLine, TerminalContext } from '@/utils/terminal/types';
import { getCommand } from '@/utils/terminal/registry';
import { useAuthStore } from '@/composables/features/auth/useAuthStore';

const { t } = useI18n();
const authStore = useAuthStore();

const history = ref<TerminalLine[]>([]);
const command = ref('');
const cmdInput = ref<HTMLInputElement | null>(null);
const terminalContainer = ref<HTMLElement | null>(null);

const isMaskedMode = ref(false);
// eslint-disable-next-line no-unused-vars
const passwordCallback = ref<((pwd: string) => void) | null>(null);

const isRoot = computed(() => authStore.user?.role === 'admin');

const promptText = computed(() => {
  if (isMaskedMode.value) return t('os.apps.terminal.commands.passwordPrompt');
  return isRoot.value ? 'ranzak@ranzakOS:~#' : 'guest@ranzakOS:~$';
});

onMounted(async () => {
  await authStore.checkRootSession();
  print(t('os.apps.terminal.welcome'));
  print(t('os.apps.terminal.hint'));
  focusInput();
});

const focusInput = () => {
  cmdInput.value?.focus();
};

const scrollToBottom = async () => {
  await nextTick();
  if (terminalContainer.value) {
    terminalContainer.value.scrollTop = terminalContainer.value.scrollHeight;
  }
};

const print = (text: string, inlinePrefix?: boolean) => {
  if (inlinePrefix) {
    history.value.push({
      prompt: text,
      content: ''
    });
  } else {
    history.value.push({ content: text });
  }
};

const context: TerminalContext = {
  print,
  clear: () => {
    history.value = [];
  },
  setPromptMode: (mode, callback) => {
    if (mode === 'password') {
      isMaskedMode.value = true;
      passwordCallback.value = callback;
    } else {
      isMaskedMode.value = false;
      passwordCallback.value = null;
    }
  },
  t: (key: string, params?: any) => t(key, params),
  isRoot: () => isRoot.value
};

const handleEnter = async () => {
  const cmd = command.value;
  const promptStr = promptText.value;

  if (isMaskedMode.value) {
    if (cmd) {
      history.value.push({ prompt: promptStr, content: '**********' });
    } else {
      history.value.push({ prompt: promptStr, content: '' });
    }

    const cb = passwordCallback.value;
    isMaskedMode.value = false;
    passwordCallback.value = null;
    command.value = '';

    if (cb) {
      await cb(cmd);
    }

    scrollToBottom();
    return;
  }

  if (!cmd.trim()) {
    history.value.push({ prompt: promptStr, content: '' });
    command.value = '';
    scrollToBottom();
    return;
  }

  history.value.push({ prompt: promptStr, content: cmd });
  command.value = '';

  const args = cmd.trim().split(/\s+/);
  const mainCmd = args[0]?.toLowerCase() || '';

  const registeredCmd = getCommand(mainCmd);

  if (registeredCmd) {
    if (registeredCmd.requiresRoot) {
      if (!isRoot.value) {
        print(`${mainCmd}: ${t('os.apps.terminal.commands.permissionDeniedRoot')}`);
        scrollToBottom();
        return;
      }
      print(t('os.apps.terminal.commands.verifyingSession'), true);
      const isSessionValid = await authStore.checkRootSession();
      if (!isSessionValid) {
        history.value.pop();
        print(`${mainCmd}: ${t('os.apps.terminal.commands.permissionDeniedSession')}`);
        scrollToBottom();
        return;
      }
      history.value.pop();
    }

    try {
      await registeredCmd.execute(args.slice(1), context);
    } catch (e) {
      print(t('os.apps.terminal.commands.executionError', { cmd: mainCmd, error: String(e) }));
    }
  } else {
    print(t('os.apps.terminal.commands.notFound', { cmd: mainCmd }));
  }

  scrollToBottom();
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

.line {
  line-height: 1.4;
  font-size: 14px;
  display: flex;
}

.input-line {
  display: flex;
  line-height: 1.4;
  font-size: 14px;
}

.prompt {
  margin-right: 8px;
  color: #fff;
  white-space: pre;
}

.content {
  white-space: pre-wrap;
  word-break: break-all;
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
