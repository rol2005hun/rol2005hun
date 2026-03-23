import type { TerminalCommand } from '../types';
import { useAuthStore } from '@/composables/features/auth/useAuthStore';
import { useAppRegistry } from '@/stores/features/os/useAppRegistry';
import { useWindowStore } from '@/stores/features/os/useWindowStore';

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

export const openCommand: TerminalCommand = {
  name: 'open',
  execute: (args, context) => {
    const registry = useAppRegistry();
    if (args.length === 0) {
      const apps = registry.installedApps.map((a) => a.id).join(', ');
      context.print(context.t('os.apps.terminal.commands.openUsage', { apps }));
      return;
    }

    const appId = args[0]!;
    const app = registry.getAppById(appId);
    if (!app) {
      context.print(context.t('os.apps.terminal.commands.openNotFound', { app: appId }));
      return;
    }

    const windowStore = useWindowStore();
    windowStore.openWindow({
      id: `${app.id}-${Date.now()}`,
      appId: app.id,
      titleKey: app.nameKey,
      width: app.defaultWidth || 800,
      height: app.defaultHeight || 600
    });
    context.print(context.t('os.apps.terminal.commands.openSuccess', { app: appId }));
  }
};

export const closeCommand: TerminalCommand = {
  name: 'close',
  execute: (args, context) => {
    const registry = useAppRegistry();
    if (args.length === 0) {
      const apps = registry.installedApps.map((a) => a.id).join(', ');
      context.print(context.t('os.apps.terminal.commands.closeUsage', { apps }));
      return;
    }

    const appId = args[0]!;
    const app = registry.getAppById(appId);
    if (!app) {
      context.print(context.t('os.apps.terminal.commands.closeNotFound', { app: appId }));
      return;
    }

    const windowStore = useWindowStore();
    const activeWindows = windowStore.windows.filter((w) => w.appId === appId);

    if (activeWindows.length === 0) {
      context.print(context.t('os.apps.terminal.commands.closeNotFound', { app: appId }));
      return;
    }

    activeWindows.forEach((w) => {
      windowStore.closeWindow(w.id);
    });

    context.print(context.t('os.apps.terminal.commands.closeSuccess', { app: appId }));
  }
};
