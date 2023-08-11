const express = require('express');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:3001' }));
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
        const content = data.content;

        // Logga när servern mottar ett meddelande
        console.log('Received message from client:', content);

        const message = new Message({ content: content, timestamp: new Date() });
        message.save();

        // Logga när servern skickar ett meddelande till alla klienter
        console.log('Sending message to all clients:', content);
        io.emit('receive-message', { content: content });
    });
});
