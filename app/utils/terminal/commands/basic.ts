import type { TerminalCommand } from '../types';
import { getAllCommands } from '../registry';

export const helpCommand: TerminalCommand = {
  name: 'commands',
  execute: (args, context) => {
    const allCmds = getAllCommands();
    const available = allCmds.filter(c => !c.requiresRoot || context.isRoot());

    let out = context.t('os.apps.terminal.commands.availableCommands') + '\n';
    available.forEach(c => {
      out += `  ${c.name.padEnd(12)} ${c.requiresRoot ? '[root] ' : ''}${c.aliases ? context.t('os.apps.terminal.commands.aliases', { aliases: c.aliases.join(', ') }) : ''}\n`;
    });
    context.print(out);
  }
};

export const clearCommand: TerminalCommand = {
  name: 'clear',
  aliases: ['cls'],
  execute: (args, context) => {
    context.clear();
  }
};

export const dateCommand: TerminalCommand = {
  name: 'date',
  execute: (args, context) => {
    context.print(new Date().toString());
  }
};

export const echoCommand: TerminalCommand = {
  name: 'echo',
  execute: (args, context) => {
    context.print(args.join(' '));
  }
};

export const versionCommand: TerminalCommand = {
  name: 'version',
  execute: (args, context) => {
    context.print(context.t('os.apps.terminal.commands.version'));
  }
};
