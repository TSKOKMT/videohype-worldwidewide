const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

let clientCount = 0;

let data = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  clientCount++;

  socket.on('disconnect', () => {
    console.log('user disconnected');
    clientCount--;
  });
  
  socket.on('userAction', (actionData) => {
    console.log('User action received:', actionData);
    data.push([actionData.text, actionData.ip]);
    console.log(data);
  });

  socket.on('pleaseData', (actionData) => {
    io.emit('hereIsData', data);
    io.emit('clientCount', clientCount);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});