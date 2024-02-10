const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

let connectedClients = {};

io.on('connection', socket => {
  const clientIP = socket.handshake.headers["cf-connecting-ip"];
  connectedClients[socket.id] = clientIP;

  // Update connected clients count
  io.emit('clientCount', Object.keys(connectedClients).length);
  // Send updated list of client IPs
  io.emit('clientList', Object.values(connectedClients));

  socket.on('disconnect', () => {
    delete connectedClients[socket.id];
    // Update connected clients count
    io.emit('clientCount', Object.keys(connectedClients).length);
    // Send updated list of client IPs
    io.emit('clientList', Object.values(connectedClients));
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
