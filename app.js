const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let clients = [];  // 配列として初期化

// Connection
io.on('connection', (socket) => {
  console.log('A client connected');
  const clientIP = socket.handshake.headers["x-forwarded-for"];
  
  // Update & send clients
  clients.push({ ip: clientIP });
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
