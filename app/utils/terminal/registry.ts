import type { TerminalCommand } from './types';
import * as basicCommands from './commands/basic';
import * as systemCommands from './commands/system';
import * as osCommands from './commands/os';
import * as adminCommands from './commands/admin';
import * as musicCommands from './commands/music';
import * as funCommands from './commands/fun';

const commands = new Map<string, TerminalCommand>();

const registerCommand = (cmd: TerminalCommand) => {
  commands.set(cmd.name, cmd);
  if (cmd.aliases) {
    cmd.aliases.forEach((alias) => commands.set(alias, cmd));
  }
};

Object.values(basicCommands).forEach(registerCommand);
Object.values(systemCommands).forEach(registerCommand);
Object.values(osCommands).forEach(registerCommand);
Object.values(adminCommands).forEach(registerCommand);
Object.values(musicCommands).forEach(registerCommand);
Object.values(funCommands).forEach(registerCommand);

export const getCommand = (name: string): TerminalCommand | undefined => {
  return commands.get(name.toLowerCase());
};

export const getAllCommands = (): TerminalCommand[] => {
  return Array.from(new Set(commands.values()));
};
