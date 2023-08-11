const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const Message = require('./models/Message'); // Import the Message model

const port = process.env.PORT || 3000;
const app = express();

// Middleware for CORS
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true
}));

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/chat', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);

        // Save message to MongoDB
        const newMessage = new Message({
            content: msg
        });

        newMessage.save()
            .then(() => {
                console.log('Message saved to database');
            })
            .catch(err => {
                console.error('Error saving message:', err);
            });

        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User left');
    });
});

server.listen(port, () => console.log(`Server running on port ${port}`));
