<template>
    <div class="chat-app">
        <div class="rooms">
            <h2>Szobák</h2>
            <ul>
                <li 
                    v-for="room in rooms" 
                    :key="room" 
                    @click="joinRoom(room)" 
                    :class="{ active: room === currentRoom }">
                    # {{ room }}
                </li>
            </ul>
        </div>
        <div class="chat">
            <h2># {{ currentRoom }}</h2>
            <div class="messages">
                <div 
                    v-for="message in currentMessages" 
                    :key="message.id" 
                    :class="['message', { 'system-message': message.isSystem }]">
                    <strong v-if="!message.isSystem">{{ message.username }}: </strong> 
                    <span>{{ message.text }}</span>
                </div>
            </div>
            <input 
                v-model="newMessage" 
                @keyup.enter="sendMessage(currentRoom)" 
                :placeholder="'Írj egy üzenetet ide: #' + currentRoom" />
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

const socket = io();
const currentRoom = ref<string>('general');
const messages = ref<Record<string, { id: string; username: string; text: string; isSystem?: boolean }[]>>({});
const currentMessages = computed(() => messages.value[currentRoom.value] || []);
const newMessage = ref<string>('');
const rooms = ref<string[]>(['general', 'random']);
const username = useCookie('username', { expires: new Date('3000-12-12'), default: () => 'user' }) as Ref<string>;
const onlineUsers = ref<string[]>([]);

onMounted(() => {
    // Üzenet érkezett
    socket.on('message', (message: { id: string; username: string; text: string; room: string }) => {
        if (!messages.value[message.room]) {
            messages.value[message.room] = [];
        }
        messages.value[message.room].push(message);
    });

    // Korábbi üzenetek betöltése
    socket.on('roomMessages', (loadedMessages: { id: string; username: string; text: string }[]) => {
        console.log(loadedMessages);
        messages.value[currentRoom.value] = loadedMessages;
    });

    // Felhasználó csatlakozott
    socket.on('userJoined', (data: { username: string; room: string }) => {
        if (!messages.value[data.room]) {
            messages.value[data.room] = [];
        }
        messages.value[data.room].push({ 
            id: Date.now().toString(), 
            username: 'System', 
            text: `${data.username} csatlakozott a(z) #${data.room} szobához.`,
            isSystem: true 
        });
    });

    // Felhasználó kilépett
    socket.on('userLeft', (data: { username: string; room: string }) => {
        if (!messages.value[data.room]) {
            messages.value[data.room] = [];
        }
        messages.value[data.room].push({ 
            id: Date.now().toString(), 
            username: 'System', 
            text: `${data.username} kilépett a(z) #${data.room} szobából.`,
            isSystem: true 
        });
    });

    // Online felhasználók frissítése
    socket.on('onlineUsers', (users: string[]) => {
        onlineUsers.value = users;
    });

    // Alapértelmezett szoba csatlakozása
    socket.emit('joinRoom', currentRoom.value, username.value);
});

function joinRoom(room: string) {
    if (room === currentRoom.value) return; // Ha már az adott szobában vagyunk, nem csinál semmit

    socket.emit('leaveRoom', currentRoom.value, username.value); // Elhagyja az aktuális szobát
    currentRoom.value = room; // Átáll az új szobára
    socket.emit('joinRoom', room, username.value); // Belép az új szobába
}

function sendMessage(room: string) {
    if (newMessage.value.trim()) {
        const message = { id: Date.now().toString(), username: username.value, text: newMessage.value, room };
        socket.emit('message', room, message);
        if (!messages.value[room]) {
            messages.value[room] = [];
        }
        messages.value[room].push(message);
        newMessage.value = '';
    }
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/apps/chat.scss';
</style>
