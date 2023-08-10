const express = require('express');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const CryptoJS = require('crypto-js');

const app = express();
const port = 3000;

mongoose.connect('mongodb://mongo:27017/game', { useNewUrlParser: true, useUnifiedTopology: true });

const MessageSchema = new mongoose.Schema({ content: String, timestamp: Date });
const Message = mongoose.model('Message', MessageSchema);

app.get('/', (req, res) => res.send('Backend is up and running!'));

const server = app.listen(port, () => console.log(`Server running on port ${port}`));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('send-message', (data) => {
        let content = data.content;

        if(data.encrypt) {
            content = CryptoJS.AES.encrypt(content, 'secretKey').toString();
        }

        const message = new Message({ content: content, timestamp: new Date() });
        message.save();

        io.emit('receive-message', { content: content });
    });
});
