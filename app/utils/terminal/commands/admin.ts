import type { TerminalCommand } from '../types';

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
