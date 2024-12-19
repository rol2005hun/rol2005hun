<template>
  <div class="chat-app">
    <div class="rooms">
      <div class="top">
        <h2>Szobák</h2>
        <ul>
          <li v-for="room in rooms" :key="room" @click="joinRoom(room)" :class="{ active: room === currentRoom }"># {{ room }}</li>
        </ul>
      </div>
      <div class="bottom">
        <label for="username">Felhasználónév:</label>
        <input v-model="username" placeholder="Felhasználónév" id="username"/>
      </div>
    </div>
    <div class="chat">
      <h2># {{ currentRoom }}</h2>
      <div class="messages" ref="messagesContainer">
        <div v-for="message in currentMessages" :key="message.id" :class="['message', { 'system-message': message.isSystem }]">
          <strong v-if="!message.isSystem">{{ message.username }}: </strong>
          <span>{{ message.text }}</span>
        </div>
      </div>
      <input v-model="newMessage" @keyup.enter="sendMessage(currentRoom)" :placeholder="'Írj egy üzenetet ide: #' + currentRoom" />
    </div>
    <div class="online-users">
      <h3>Online Felhasználók:</h3>
      <ul>
        <li v-if="onlineUsers.length === 0">Senki</li>
        <li v-for="user in onlineUsers" :key="user">{{ user }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { io } from 'socket.io-client';
import { ref, computed, onMounted, nextTick } from 'vue';

const socket = io('https://v2socketr.onrender.com/');
const currentRoom = ref<string>('general');
const messages = ref<Record<string, { id: string; username: string; text: string; isSystem?: boolean }[]>>({});
const currentMessages = computed(() => messages.value[currentRoom.value] || []);
const newMessage = ref<string>('');
const rooms = ref<string[]>(['general', 'ranzak???v3??coming??soon']);
const username = useCookie('username', { expires: new Date('3000-12-12'), default: () => 'user' }) as Ref<string>;
const onlineUsers = ref<string[]>([]);

onMounted(() => {
    socket.on('message', (message: { id: string; username: string; text: string; room: string }) => {
        if (!messages.value[message.room]) messages.value[message.room] = [];
        messages.value[message.room].push(message);
        scrollToBottom();
    });

    socket.on('roomMessages', (loadedMessages: { id: string; username: string; text: string }[]) => {
        messages.value[currentRoom.value] = loadedMessages;
        scrollToBottom();
    });

    socket.on('roomOnlineUsers', (oUsers: string[]) => {
        onlineUsers.value = oUsers;
    });

    socket.on('userJoined', (data: { username: string; room: string }) => {
        if (!messages.value[data.room]) messages.value[data.room] = [];
        messages.value[data.room].push({
            id: Date.now().toString(),
            username: 'System',
            text: `${data.username} csatlakozott a(z) #${data.room} szobához.`,
            isSystem: true
        });
        scrollToBottom();
    });

    socket.on('userLeft', (data: { username: string; room: string }) => {
        if (!messages.value[data.room]) messages.value[data.room] = [];
        messages.value[data.room].push({
            id: Date.now().toString(),
            username: 'System',
            text: `${data.username} kilépett a(z) #${data.room} szobából.`,
            isSystem: true
        });
        scrollToBottom();
    });

    socket.emit('joinRoom', currentRoom.value, username.value);
});

function joinRoom(room: string) {
    if (room === currentRoom.value) return;
    socket.emit('leaveRoom', currentRoom.value, username.value);
    currentRoom.value = room;
    socket.emit('joinRoom', room, username.value);
}

function sendMessage(room: string) {
    if (newMessage.value.trim()) {
        const message = { id: Date.now().toString(), username: username.value, text: newMessage.value, room };
        socket.emit('message', room, message);
        if (!messages.value[room]) messages.value[room] = [];
        messages.value[room].push(message);
        newMessage.value = '';
    }
}

function scrollToBottom() {
    nextTick(() => {
        const messagesContainer = document.querySelector('.messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/apps/chat.scss';
</style>
