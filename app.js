const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let contents = [];

// Connection
io.on('connection', (socket) => {
  const appId = socket.handshake.query.appId;

  console.log(`Connection from app: ${appId}`);

  if (appId === 'imageChat') {

  }
  else if (appId === 'infinityRect') {
    socket.on('pleaseContent', () => {
      if (contents) io.emit('content', contents[contents.length - 1]);
    });
  
    socket.on('content', (content) => {
      contents.push(content);
    });
  }

  socket.on('disconnect', () => {
  });
});

// Listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
