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

//countPeople
let clients = [];

// Connection
io.on('connection', (socket) => {
  const appId = socket.handshake.query.appId;

  console.log(`Connection from app: ${appId}`);

  const clientIP = socket.handshake.headers["cf-connecting-ip"];

  //IMAGE CHAT
  if (appId === 'imageChat') {
    socket.emit('hello', { messages, clientIP });

    //Receave & broadcast
    /*socket.on('newMessage', (text) => {
      const newMessage = { text, clientId: clientIP };
      messages.push(newMessage);
      console.log('Saved Message: ', newMessage);

      io.emit('newMessage', newMessage);
    });*/

    socket.on('newMessage', (newMessage) => {
      const newMessage = { imageSrc: newMessage.imageSrc, timeString: newMessage.timeString, clientID: clientIP };
      messages.push(newMessage);
      io.emit('newMessage', newMessage);
    });
  }

  //INFINITY RECT
  else if (appId === 'infinityRect') {
    socket.on('pleaseContent', () => {
      if (contents.length > 0) io.emit('content', contents[contents.length - 1]);
    });

    socket.on('content', (content) => {
      contents.push(content);
      // サイズが100を超えた場合、最古の要素を削除
      while (contents.length > 100) {
        contents.shift(); // 配列の最初の要素を削除
      }
    });
  }

  //COUNT PEOPLE
  else if (appId === 'countPeople') {
    // Update & send clients
    clients.push({ id: socket.id, ip: clientIP });
    io.emit('clients', clients);

    socket.on('disconnect', () => {
      // Update & send clients
      clients = clients.filter(client => client.id !== socket.id);
      io.emit('clients', clients);
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
