import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const roomMessages: Record<string, { id: string; username: string; text: string }[]> = {};
const roomUsers: Record<string, string[]> = {};
const users: { [key: string]: string } = {};

io.on('connection', (socket) => {
    console.log(`[${socket.id}] csatlakozott, jelenleg online: ${io.engine.clientsCount} fő`);

    socket.on('joinRoom', (room: string, username: string) => {
        if (!socket.rooms.has(room)) {
            socket.join(room);
            users[socket.id] = username;

            if (!roomUsers[room]) {
                roomUsers[room] = [];
            }
            roomUsers[room].push(username);

            console.log(`[${socket.id}] ${username} belépett a #${room} csatornába`);

            const joinMessage = { id: Date.now().toString(), username: 'System', text: `${username} csatlakozott a(z) #${room} szobához.`, isSystem: true };
            if (!roomMessages[room]) roomMessages[room] = [];
            roomMessages[room].push(joinMessage);
            socket.emit('roomMessages', roomMessages[room] || []);
            socket.broadcast.to(room).emit('userJoined', { username, room });
            socket.to(room).emit('message', joinMessage);

            io.emit('onlineUsers', Object.values(users));

            socket.emit('roomOnlineUsers', roomUsers[room]);
            socket.broadcast.to(room).emit('roomOnlineUsers', roomUsers[room]);
        }
    });

    socket.on('leaveRoom', (room: string, username: string) => {
        socket.leave(room);
        console.log(`[${socket.id}] ${username} elhagyta a #${room} szobát`);

        const leaveMessage = { id: Date.now().toString(), username: 'System', text: `${username} kilépett a(z) #${room} szobából.`, isSystem: true };
        if (!roomMessages[room]) roomMessages[room] = [];
        roomMessages[room].push(leaveMessage);

        roomUsers[room] = roomUsers[room].filter((user) => user !== username);

        socket.broadcast.to(room).emit('userLeft', { username, room });
        socket.broadcast.to(room).emit('message', leaveMessage);
        socket.emit('roomOnlineUsers', roomUsers[room]);
        socket.broadcast.to(room).emit('roomOnlineUsers', roomUsers[room]);

        io.emit('onlineUsers', Object.values(users));
    });

    socket.on('message', (room: string, message: { id: string; username: string; text: string }) => {
        if (!roomMessages[room]) roomMessages[room] = [];
        roomMessages[room].push(message);
        socket.broadcast.to(room).emit('message', message);
        console.log(`[${socket.id}] üzenetet küldött a(z) #${room} csatornába: ${message.text}`);
    });

    socket.on('roomOnlineUsers', (room: string) => {
        socket.emit('roomOnlineUsers', roomUsers[room]);
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        console.log(`[${socket.id}] ${username} lecsatlakozott, jelenleg online: ${io.engine.clientsCount} fő`);

        io.sockets.adapter.rooms.forEach((room, roomName) => {
        if (room.has(socket.id)) {
            socket.broadcast.to(roomName).emit('userLeft', { username, room: roomName });
            roomUsers[roomName] = roomUsers[roomName].filter((user) => user !== username);
        }
        });
        io.emit('onlineUsers', Object.values(users));
    });
});

app.get('/', (req, res) => {
    res.send('Socket.IO szerver működik!');
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`A szerver fut a http://localhost:${PORT} címen.`);
});
