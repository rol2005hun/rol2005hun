import type { TerminalCommand } from '../types';
import { useWindowStore } from '@/stores/features/os/useWindowStore';

export const rebootCommand: TerminalCommand = {
  name: 'reboot',
  requiresRoot: true,
  execute: (args, context) => {
    context.print(context.t('os.apps.terminal.commands.rebooting'));
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
};

export const clearlogsCommand: TerminalCommand = {
  name: 'clearlogs',
  requiresRoot: true,
  execute: (args, context) => {
    context.print(context.t('os.apps.terminal.commands.logsCleared'));
  }
};

export const killallCommand: TerminalCommand = {
  name: 'killall',
  requiresRoot: true,
  execute: (args, context) => {
    const windowStore = useWindowStore();
    const count = windowStore.windows.length;
    windowStore.windows.forEach((w) => {
      windowStore.closeWindow(w.id);
    });
    context.print(context.t('os.apps.terminal.commands.killallSuccess', { count }));
  }
};
