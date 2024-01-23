import { defineStore } from 'pinia';

interface Notification {
    id: number,
    type: string,
    message: string
}

let index = 1;

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [] as Notification[]
    }),
  
    actions: {
        addNotification(notification: Notification) {
            this.notifications.push({
                ...notification,
                id: index++
            });

            const audio = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3');
            audio.play();

            setTimeout(() => {
                const notificationId = Math.min(...this.notifications.map(x => x.id));
                this.deleteNotification(notificationId);
            }, 5000)
        },

        deleteNotification(id: number) {
            this.notifications.splice(this.notifications.map(x => x.id).indexOf(id), 1);
        }
    },
});
