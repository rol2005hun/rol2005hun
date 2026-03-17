import type { TerminalCommand } from '../types';
import { useAuthStore } from '@/composables/features/auth/useAuthStore';

export const unameCommand: TerminalCommand = {
  name: 'uname',
  execute: (args, context) => {
    context.print(context.t('os.apps.terminal.commands.uname'));
  }
};

export const systeminfoCommand: TerminalCommand = {
  name: 'systeminfo',
  execute: (args, context) => {
    context.print(context.t('os.apps.terminal.commands.systeminfo'));
  }
};

export const sudoCommand: TerminalCommand = {
  name: 'sudo',
  execute: (args, context) => {
    if (context.isRoot()) {
      context.print(context.t('os.apps.terminal.commands.sudoRoot'));
    } else {
      context.print(context.t('os.apps.terminal.commands.sudoGuest'));
    }
  }
};

export const logoutCommand: TerminalCommand = {
  name: 'logout',
  aliases: ['exit'],
  execute: (args, context) => {
    if (context.isRoot()) {
      const authStore = useAuthStore();
      if (authStore.user?.username === 'root') {
        authStore.logoutRoot();
      }
      context.print(context.t('os.apps.terminal.commands.logoutSuccess'));
    } else {
      context.print(context.t('os.apps.terminal.commands.notLoggedIn'));
    }
  }
};
