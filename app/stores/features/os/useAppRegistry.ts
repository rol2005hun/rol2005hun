import { defineStore } from 'pinia';
import { shallowRef } from 'vue';
import SettingsApp from '@/components/features/os/apps/settings/SettingsApp.vue';

export const appComponents: Record<string, any> = {
  settings: SettingsApp
};

export interface AppDefinition {
  id: string;
  nameKey: string;
  icon: string;
  logo?: string;
  defaultWidth?: number;
  defaultHeight?: number;
  allowMultipleInstances?: boolean;
}

export const useAppRegistry = defineStore('os-app-registry', () => {
  const installedApps = shallowRef<AppDefinition[]>([
    {
      id: 'settings',
      nameKey: 'os.apps.settings.name',
      icon: 'ph:gear-six-fill',
      defaultWidth: 600,
      defaultHeight: 450,
      allowMultipleInstances: false,
    },
  ]);

  const getAppById = (id: string) => installedApps.value.find(app => app.id === id);

  const updateAppLogo = (id: string, logoUrl: string) => {
    const app = installedApps.value.find(a => a.id === id);
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
