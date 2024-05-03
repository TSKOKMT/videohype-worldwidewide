const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const messages = [];

//Connection
io.on('connection', (socket) => {
  console.log('A client connected');

  const clientIP = socket.handshake.headers["cf-connecting-ip"];
  socket.emit('yourIP', clientIP);

  //Once send all messages
  socket.emit('allMessages', messages);

  //Receave & broadcast
  socket.on('newMessage', (text) => {
    const newMessage = { text, clientId: clientIP };
    messages.push(newMessage);
    console.log('Saved Message: ', newMessage);
    
    io.emit('newMessage', newMessage);
  });
});

//Listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});