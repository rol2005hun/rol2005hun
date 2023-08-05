import { createPinia } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import { useNotificationStore } from '@/store/modules/notification';

export const pinia = createPinia();

export const userStore = useUserStore(pinia);
export const notificationStore = useNotificationStore(pinia);