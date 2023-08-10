import React, { useState } from 'react';
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:3000");

function App() {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        socket.emit("send-message", { content: message, encrypt: true });
    };

    socket.on("receive-message", (data) => {
        console.log(data.content);
    });

    return (
        <div className="App">
            <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default App;
