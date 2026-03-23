import type { TerminalCommand } from '../types';
import { useAuthStore } from '@/composables/features/auth/useAuthStore';

export const whoamiCommand: TerminalCommand = {
  name: 'whoami',
  execute: (args, context) => {
    const authStore = useAuthStore();
    context.print(authStore.user?.username || 'guest');
  }
};

export const suCommand: TerminalCommand = {
  name: 'su',
  aliases: ['login'],
  execute: async (args, context) => {
    if (args.length === 0) {
      context.print(context.t('os.apps.terminal.commands.suUsage'));
      return;
    }

    if (context.isRoot()) {
      context.print(context.t('os.apps.terminal.commands.alreadyRoot'));
      return;
    }

    if (args[0] === 'root') {
      context.setPromptMode('password', async (password) => {
        try {
          const res = await $fetch<{ success: boolean; token?: string }>('/api/terminal/auth', {
            method: 'POST',
            body: { password }
          });
          const authStore = useAuthStore();
          if (res.success && res.token) {
            authStore.loginRoot(res.token);
            context.print(context.t('os.apps.terminal.commands.suSuccessRoot'));
          } else {
            context.print(context.t('os.apps.terminal.commands.suAuthenticationFailure'));
          }
        } catch {
          context.print(context.t('os.apps.terminal.commands.suAuthenticationFailure'));
        }
      });
    } else {
      context.print(
        context.t('os.apps.terminal.commands.suUserNotFound', { user: args[0] || 'root' })
      );
    }
  }
};
