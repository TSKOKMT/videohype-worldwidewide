const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

//Connection
io.on('connection', (socket) => {
  console.log('A client connected');

  /*const clientIP = socket.handshake.headers["cf-connecting-ip"];

  socket.emit('hello', clientIP);*/

  //Receave & broadcast
  socket.on('theHTML', (theHTML) => {
    console.log('Received: ', theHTML);
    
    io.emit('theHTML', theHTML);
  });
});

//Listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});