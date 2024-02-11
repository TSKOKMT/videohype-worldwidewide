const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

let connectedClients = {};

let messageText = '';

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    const clientIP = socket.handshake.address;
    connectedClients[socket.id] = clientIP;

    io.emit('clientCount', Object.keys(connectedClients).length);
    io.emit('clientList', Object.values(connectedClients));
    io.emit('yourIP', clientIP.toString());
    io.emit('yourColor', ipToHexColor(clientIP.toString()));

    socket.on('disconnect', () => {
        console.log('user disconnected');

        delete connectedClients[socket.id];
        io.emit('clientCount', Object.keys(connectedClients).length);
        io.emit('clientList', Object.values(connectedClients));
    });
    
    socket.on('userAction', (actionData) => {
        console.log('User action received:', actionData);
        // Broadcast the action data to all connected clients
        messageText += clientIP.toString() + '\n';
        io.emit('actionBroadcast', messageText);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

function ipToHexColor(ipAddress) {
    // Hash the IP address to generate a consistent color
    const hashCode = hashCodeFromString(ipAddress);

    // Convert the hash code to a hexadecimal color string
    const hexColor = '#' + loopedHashCodeToHex(hashCode);

    return hexColor;
}

// Function to generate a hash code from a string
function hashCodeFromString(str) {
    let hashCode = 0;
    if (str.length === 0) return hashCode;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hashCode = ((hashCode << 5) - hashCode) + char;
        hashCode |= 0; // Convert to 32bit integer
    }
    return hashCode;
}

// Function to convert looped hash code to hex color string
function loopedHashCodeToHex(hashCode) {
    let hexString = '';
    for (let i = 0; i < 3; i++) {
        const segment = (hashCode >> (8 * i)) & 255;
        hexString += segment.toString(16).padStart(2, '0');
    }
    return hexString;
}