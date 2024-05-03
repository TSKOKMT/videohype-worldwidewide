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

  //Receave & broadcast
  socket.on('sendMessage', (messageText) => {
    const newMessage = {
      clientId: socket.id,
      text: messageText
    };
    messages.push(newMessage);
    console.log('Saved Message: ', newMessage);
    
    io.emit('receiveMessage', newMessage);
  });
});

//Listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});