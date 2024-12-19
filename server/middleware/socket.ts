import { Server } from 'socket.io';
import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
    const server = event.node.req.socket?.server;
    const io = new Server(server);

    // Üzenetek tárolása
    const roomMessages: Record<string, { id: string; username: string; text: string }[]> = {};

    // Felhasználók tárolása
    const users: { [key: string]: string } = {};

    io.on('connection', (socket) => {
        console.log(`[${socket.id}] csatlakozott, jelenleg online: ${io.engine.clientsCount} fő`);

        // Szoba csatlakozás
        socket.on('joinRoom', (room: string, username: string) => {
            if (!socket.rooms.has(room)) {
                socket.join(room);
                users[socket.id] = username;
                console.log(`[${socket.id}] ${username} belépett a #${room} csatornába`);

                // Korábbi üzenetek küldése az új csatlakozónak
                socket.emit('roomMessages', roomMessages[room] || []);

                // Értesítés a szobában lévőknek
                socket.broadcast.to(room).emit('userJoined', { username: username, room });
                io.emit('onlineUsers', Object.values(users));
            } else {
                console.log(`[${socket.id}] ${username} már csatlakozott a #${room} csatornához`);
            }
        });

        // Üzenet fogadása
        socket.on('message', (room: string, message: { id: string; username: string; text: string }) => {
            // Mentjük az üzenetet a megfelelő szobához
            if (!roomMessages[room]) {
                roomMessages[room] = [];
            }
            roomMessages[room].push(message);

            // Továbbítjuk az üzenetet a szobában lévőknek
            socket.broadcast.to(room).emit('message', message);
            console.log(`[${socket.id}] üzenetet küldött a(z) #${room} csatornába: ${message.text}`);
        });

        // Felhasználó lecsatlakozott
        socket.on('disconnect', () => {
            const username = users[socket.id];
            delete users[socket.id];
            console.log(`[${socket.id}] ${username} lecsatlakozott, jelenleg online: ${io.engine.clientsCount} fő`);

            // Értesítés minden szobában, ahonnan kilépett
            io.sockets.adapter.rooms.forEach((room, roomName) => {
                if (room.has(socket.id)) {
                    socket.broadcast.to(roomName).emit('userLeft', { username: username, room: roomName });
                }
            });

            // Frissített felhasználói lista
            io.emit('onlineUsers', Object.values(users));
        });
    });
});