import React, { useState } from 'react';
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:3000");

function App() {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        // Logga när klienten skickar ett meddelande till servern
        console.log('Sending message to server:', message);
        socket.emit("send-message", { content: message });
    };

    socket.on("receive-message", (data) => {
        // Logga när klienten mottar ett meddelande från servern
        console.log('Received message from server:', data.content);
    });

    return (
        <div className="App">
            <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default App;
