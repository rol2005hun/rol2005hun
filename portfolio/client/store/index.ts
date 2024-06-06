import { createPinia } from 'pinia';
import { useNotificationStore } from '@/store/modules/notification';

export const pinia = createPinia();

export const notificationStore = useNotificationStore(pinia);