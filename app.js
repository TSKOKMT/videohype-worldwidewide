const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//Connect
io.on('connection', (socket) => {
  console.log('A client connected');

  // HTMLデータの受信
  socket.on('sendHTML', (html) => {
    socket.broadcast.emit('receiveHTML', html);
  });

  //Disconnect
  socket.on('disconnect', () => {
    console.log('A client disconnected');
    clientCount--;
    clearInterval(heartbeatInterval);
  });
});

//Listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});