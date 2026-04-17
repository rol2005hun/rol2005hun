export interface TerminalLine {
  prompt?: string;
  content: string;
  isHtml?: boolean;
}

export interface TerminalContext {
  print: (text: string, inlinePrefix?: boolean, isHtml?: boolean) => void;
  clear: () => void;
  setPromptMode: (mode: 'password' | 'text', callback: (pwd: string) => void) => void;
  t: (key: string, params?: Record<string, any>) => string;
  isRoot: () => boolean;
}

export interface TerminalCommand {
  name: string;
  aliases?: string[];
  descriptionKey?: string;
  requiresRoot?: boolean;
  execute: (args: string[], context: TerminalContext) => Promise<void> | void;
}
