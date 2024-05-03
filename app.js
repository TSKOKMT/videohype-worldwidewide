const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let clients = {};

//Connection
io.on('connection', (socket) => {
  console.log('A client connected');

  const clientIP = socket.handshake.headers["cf-connecting-ip"];

  //Update & send clinents
  clients.push({ ip: clientIP });
  io.emit('clients', clients);

  socket.on('disconnect', () => {
    //Update & send clinents
    clients.forEach(client => {
      if (client.ip == clientIP) client.remove();
    });
    io.emit('clients', clients);
  });
});

//Listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});