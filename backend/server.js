const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:3001' }));
const port = 3000;

app.get('/', (req, res) => res.send('Backend is up and running!'));

const server = app.listen(port, () => console.log(`Server running on port ${port}`));

const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('send-message', (data) => {
        const content = data.content;

        // Log when the server receives a message
        console.log('Received message from client:', content);

        // Log when the server sends a message to all clients
        console.log('Sending message to all clients:', content);
        io.emit('receive-message', { content: content });
    });
});
