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

  //Receave & broadcast
  socket.on('mousePosition', (mousePosition) => {
    console.log('Received: ', mousePosition);

    io.emit('mousePosition', mousePosition);
  });
});

//Listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});