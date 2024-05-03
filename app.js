const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let clients = [];

// Connection
io.on('connection', (socket) => {
  console.log('A client connected');
  const clientIP = socket.handshake.headers["cf-connecting-ip"];

  // Update & send clients
  clients.push({ id: socket.id, ip: clientIP });
  io.emit('clients', clients);

  socket.on('disconnect', () => {
    // Update & send clients
    clients = clients.filter(client => client.ip !== clientIP);
    io.emit('clients', clients);
  });
});

// Listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
