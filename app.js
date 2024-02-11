const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let clientCount = 0;
let data = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//Connect
io.on('connection', (socket) => {
  console.log('a user connected');
  clientCount++;

  //Disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
    clientCount--;
  });
  
  //Button pressed
  socket.on('buttonPressed', (buttonData) => {
    console.log('Received from client :', buttonData);
    data.push([buttonData.text, buttonData.ip]);
  });

  //Update
  socket.on('update', () => {
    io.emit('data', data);
    io.emit('clientCount', clientCount);
  });
});

//Listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});