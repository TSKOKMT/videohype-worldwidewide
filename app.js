const express = require('express');
const WebSocket = require('ws');

const app = express();

app.set('trust proxy', true);

const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws, req) => {
    // Add client to the list
    clients.push({ ip: req.connection.remoteAddress, ws });

    // Send the list of clients to all connected clients
    broadcastConnectedClients();

    // Listen for client messages
    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });

    // Handle client disconnection
    ws.on('close', () => {
        // Remove disconnected client from the list
        clients = clients.filter(client => client.ws !== ws);

        // Send the updated list of clients to all connected clients
        broadcastConnectedClients();
    });
});

// Function to broadcast the number of connected clients and their IP addresses
function broadcastConnectedClients() {
    const connectedClients = clients.map(client => client.ip);
    const message = {
        type: 'connected_clients',
        count: clients.length,
        clients: connectedClients
    };
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// Express route to serve HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
