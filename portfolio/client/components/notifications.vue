<template>
    <transition-group name="list" tag="div" class="notifications-list">
      <div v-for="notification in notifications" :key="notification.id">
          <div :class="'notification ' + notification.type">
              <div class="before-icons">
                  <i v-if="notification.type == 'success'" class="fas fa-check-circle"></i>
                  <i v-if="notification.type == 'error'" class="fas fa-times-circle"></i>
                  <i v-if="notification.type == 'information'" class="fas fa-info-circle"></i>
                  <i v-if="notification.type == 'warning'" class="fas fa-exclamation-circle"></i>
              </div>
              <div @click="close(notification.id)" class="close-btn"><i class="fas fa-times"></i></div>
              <h2>{{ notificationTitle(notification.type) }}</h2>
              <h3 v-html="notification.message"></h3>
          </div>
      </div>
    </transition-group>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { notificationStore } from '@/store';

const notifications = ref(notificationStore.$state.notifications);

function notificationTitle(notification: string) {
    switch(notification) {
        case 'success': return 'Siker';
        case 'error': return 'Hiba';
        case 'information': return 'Információ';
        case 'warning': return 'Figyelmeztetés';
    }
}

function close(id: number) {
    notificationStore.deleteNotification(id);
}
</script>

<style lang="scss">
@import '@/assets/scss/notifications.scss';
</style>