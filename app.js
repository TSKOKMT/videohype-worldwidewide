const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

//imageChat
let messages = [];

//infinityRect
let contents = [];

// Connection
io.on('connection', (socket) => {
  const appId = socket.handshake.query.appId;

  console.log(`Connection from app: ${appId}`);

  const clientIP = socket.handshake.headers["cf-connecting-ip"];

  if (appId === 'imageChat') {
    socket.emit('hello', { messages, clientIP });

    //Receave & broadcast
    socket.on('newMessage', (text) => {
      const newMessage = { text, clientId: clientIP };
      messages.push(newMessage);
      console.log('Saved Message: ', newMessage);

      io.emit('newMessage', newMessage);
    });
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
