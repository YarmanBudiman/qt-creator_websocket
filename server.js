
// 1. Import WebSocket module
const WebSocket = require('ws');

// 2. Buat WebSocket Server di port 12345
const wss = new WebSocket.Server({ host: '0.0.0.0', port: 12222 });






const clients = {}; // Menyimpan client berdasarkan userId atau username

wss.on('connection', function connection(ws) {
  let userId = null;

  ws.on('message', function incoming(message) {
    try {
        const data = JSON.parse(message);
        console.log(`Sender: ${data.type}`);
        if (data.type === 'register' && data.userId) {
          userId = data.userId;
          clients[userId] = ws;
          console.log(`User ${userId} registered.`);
        }
    
        else if (data.type === 'message' && data.to && data.from && data.content) {
          const toClient = clients[data.to];
          console.log(`Sender: ${data.from}`);
          console.log(`To: ${data.to}`);
          console.log(`Clients:`, Object.keys(clients));
          console.log(`toClient is:`, toClient);
    
          if (toClient && toClient.readyState === WebSocket.OPEN) {
            toClient.send(JSON.stringify({
              from: data.from,
              content: data.content
            }));
            console.log("Data delivered.");
          } else {
            console.log(`User ${data.to} is not connected.`);
          }
        }

    } catch (err) {
      console.error('Invalid message:', err);
    }
  });

  ws.on('close', () => {
    if (userId && clients[userId]) {
      delete clients[userId];
      console.log(`User ${userId} disconnected.`);
    }
  });
});


console.log('WebSocket server is running on ws://localhost:12222');

