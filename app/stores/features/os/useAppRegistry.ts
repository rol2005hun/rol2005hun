import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface AppDefinition {
  id: string;
  nameKey: string;
  icon: string;
  logo?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  allowMultipleInstances?: boolean;
  showOnDesktop?: boolean;
  showInStartMenu?: boolean;
}

export const useAppRegistry = defineStore('os-app-registry', () => {
  const installedApps = ref<AppDefinition[]>([
    {
      id: 'browser',
      nameKey: 'os.apps.browser.name',
      icon: 'ph:globe-hemisphere-west-fill',
      defaultWidth: 900,
      defaultHeight: 600,
      allowMultipleInstances: true
    },
    {
      id: 'terminal',
      nameKey: 'os.apps.terminal.name',
      icon: 'ph:terminal-window-fill',
      defaultWidth: 700,
      defaultHeight: 450,
      allowMultipleInstances: true
    },
    {
      id: 'projects',
      nameKey: 'os.apps.projects.name',
      icon: 'ph:folder-open-fill',
      defaultWidth: 800,
      defaultHeight: 500,
      allowMultipleInstances: false
    },
    {
      id: 'settings',
      nameKey: 'os.apps.settings.name',
      icon: 'ph:gear-six-fill',
      defaultWidth: 700,
      defaultHeight: 550,
      allowMultipleInstances: false,
      showOnDesktop: false
    },
    {
      id: 'about',
      nameKey: 'os.apps.about.name',
      icon: 'ph:info-fill',
      defaultWidth: 700,
      defaultHeight: 550,
      allowMultipleInstances: false,
      showOnDesktop: false
    },
    {
      id: 'changelog',
      nameKey: 'changelog.title',
      icon: 'ph:list-dashes-bold',
      defaultWidth: 650,
      defaultHeight: 550,
      allowMultipleInstances: false,
      showOnDesktop: false,
      showInStartMenu: false
    }
  ]);

  const getAppById = (id: string) => installedApps.value.find((app) => app.id === id);

  const updateAppLogo = (id: string, logoUrl: string) => {
    const app = installedApps.value.find((a) => a.id === id);
    if (app) {
      app.logo = logoUrl;
      installedApps.value = [...installedApps.value];
    }
  };

  return {
    installedApps,
    getAppById,
    updateAppLogo
  };
});
