import { defineStore } from 'pinia';
import { shallowRef } from 'vue';
import SettingsApp from '@/components/features/os/apps/settings/SettingsApp.vue';

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  component: any;
  defaultWidth?: number;
  defaultHeight?: number;
}

export const useAppRegistry = defineStore('os-app-registry', () => {
  const installedApps = shallowRef<AppDefinition[]>([
    {
      id: 'settings',
      name: 'System Settings',
      icon: 'ph:gear-six-fill',
      component: SettingsApp,
      defaultWidth: 600,
      defaultHeight: 450,
    },
  ]);

  const getAppById = (id: string) => installedApps.value.find(app => app.id === id);

  return {
    installedApps,
    getAppById,
  };
});
