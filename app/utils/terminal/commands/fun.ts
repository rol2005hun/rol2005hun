import type { TerminalCommand } from '../types';
import { useThemeStore } from '@/stores/features/os/useThemeStore';

export const neofetchCommand: TerminalCommand = {
  name: 'neofetch',
  aliases: ['fastfetch', 'fetch'],
  execute: (args, context) => {
    const themeStore = useThemeStore();
    const resolution = `${window.innerWidth}x${window.innerHeight}`;
    const userAgent = navigator.userAgent.substring(0, 30) + '...';

    const uptimeHours = Math.floor(performance.now() / 3600000);
    const uptimeMins = Math.floor((performance.now() % 3600000) / 60000);

    context.print(
      `<div style="display: flex; gap: 20px; align-items: flex-start; margin-top: 10px; margin-bottom: 10px; flex-wrap: nowrap; overflow-x: auto;">
        <pre style="color: var(--os-primary-color); font-size: 11px; line-height: 1.2; margin: 0; min-width: max-content;">
                           _     ___  ____
  _ __ __ _ _ __  ______ _| | __/ _ \\/ ___|
 | '__/ _\` | '_ \\|_  / _\` | |/ / | | \\___ \\
 | | | (_| | | | |/ / (_| |   <| |_| |___) |
 |_|  \\__,_|_| |_/___\\__,_|_|\\_\\\\___/|____/
        </pre>
          <div style="font-size: 13px; min-width: max-content; display: flex; flex-direction: column; gap: 2px; white-space: normal; line-height: 1.5;">
          <div style="color: var(--os-primary-color); font-weight: bold; margin-bottom: 5px;">${context.t('os.apps.terminal.commands.fun.neofetchTitle')}</div>
          <div>-----------------</div>
          <div><b>${context.t('os.apps.terminal.commands.fun.os')}</b></div>
          <div><b>${context.t('os.apps.terminal.commands.fun.kernel')}</b></div>
          <div><b>${context.t('os.apps.terminal.commands.fun.uptime', { hours: uptimeHours, minutes: uptimeMins })}</b></div>
          <div><b>${context.t('os.apps.terminal.commands.fun.resolution', { res: resolution })}</b></div>
          <div><b>${context.t('os.apps.terminal.commands.fun.theme', { theme: themeStore.currentTheme })}</b></div>
          <div><b>${context.t('os.apps.terminal.commands.fun.browser', { browser: userAgent })}</b></div>
          <div style="margin-top: 8px; display: flex; gap: 4px;">
            <div style="width: 15px; height: 15px; background: #000; border-radius: 50%;"></div>
            <div style="width: 15px; height: 15px; background: #f00; border-radius: 50%;"></div>
            <div style="width: 15px; height: 15px; background: #0f0; border-radius: 50%;"></div>
            <div style="width: 15px; height: 15px; background: #ff0; border-radius: 50%;"></div>
            <div style="width: 15px; height: 15px; background: #00f; border-radius: 50%;"></div>
            <div style="width: 15px; height: 15px; background: #f0f; border-radius: 50%;"></div>
            <div style="width: 15px; height: 15px; background: #0ff; border-radius: 50%;"></div>
            <div style="width: 15px; height: 15px; background: #fff; border-radius: 50%;"></div>
          </div>
        </div>
      </div>`,
      false,
      true
    );
  }
};

export const pingCommand: TerminalCommand = {
  name: 'ping',
  execute: async (args, context) => {
    if (args.length === 0) {
      context.print(context.t('os.apps.terminal.commands.fun.pingUsage'));
      return;
    }
    const host = args[0];
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    context.print(context.t('os.apps.terminal.commands.fun.pingData', { host, ip }));

    for (let i = 1; i <= 4; i++) {
      await new Promise((r) => setTimeout(r, 900));
      const time = (Math.random() * 30 + 10).toFixed(1);
      context.print(context.t('os.apps.terminal.commands.fun.pingReply', { ip, seq: i, time }));
    }

    await new Promise((r) => setTimeout(r, 400));
    context.print(context.t('os.apps.terminal.commands.fun.pingStatHeader', { host }));
    context.print(context.t('os.apps.terminal.commands.fun.pingStatDetail'));
  }
};

export const dfCommand: TerminalCommand = {
  name: 'df',
  aliases: ['free'],
  execute: (args, context) => {
    const memoryNav = (navigator as any).deviceMemory;
    const gb = memoryNav ? memoryNav : 8;

    context.print(context.t('os.apps.terminal.commands.fun.dfHeader'));
    context.print(
      context.t('os.apps.terminal.commands.fun.dfRoot', {
        rootTotal: gb * 1024 * 1024,
        rootUsed: Math.floor(Math.random() * 2000000)
      })
    );
    context.print(context.t('os.apps.terminal.commands.fun.dfTmpfs'));
    context.print(context.t('os.apps.terminal.commands.fun.dfBrowserfs'));
  }
};

export const matrixCommand: TerminalCommand = {
  name: 'matrix',
  execute: async (args, context) => {
    context.print(
      `<span style="color: #0f0; opacity: 0.8">${context.t('os.apps.terminal.commands.fun.matrixInit')}</span>`,
      false,
      true
    );
    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 70));
      let chars = '';
      for (let j = 0; j < 40; j++) {
        chars += String.fromCharCode(Math.floor(Math.random() * 94) + 33) + ' ';
      }
      context.print(
        `<span style="color: #0f0; opacity: ${Math.random() * 0.5 + 0.3}; font-family: monospace;">${chars}</span>`,
        false,
        true
      );
    }
  }
};

export const themeCommand: TerminalCommand = {
  name: 'theme',
  execute: (args, context) => {
    const themeStore = useThemeStore();

    if (args.length > 0) {
      const targetTheme = args[0];
      const found = themeStore.availableThemes.find((t) => t.id === targetTheme);

      if (found) {
        themeStore.setTheme(found.id);
        context.print(context.t('os.apps.terminal.commands.fun.themeSuccess', { theme: found.id }));
      } else {
        const available = themeStore.availableThemes.map((t) => t.id).join(', ');
        context.print(context.t('os.apps.terminal.commands.fun.themeNotFound', { available }));
      }
      return;
    }

    const available = themeStore.availableThemes.map((t) => t.id).join(', ');
    context.print(
      context.t('os.apps.terminal.commands.fun.themeCurrent', { theme: themeStore.currentTheme })
    );
    context.print(context.t('os.apps.terminal.commands.fun.themeUsage'));
    context.print(context.t('os.apps.terminal.commands.fun.themeAvailable', { available }));
  }
};
