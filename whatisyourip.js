const http = require('node:http');
const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {
    const clientIP = req.connection.remoteAddress;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`VIDEO HYPE : World Wide Wide\nv0.1\nYour IP address is ${clientIP}\n`);
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});