// Import required modules
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { v4 } = require('uuid');
const uuidV4 = v4;

// Create an Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

const userUid = uuidV4();
// Socket.io connection handling
io.on('connection', (socket) => {

  console.log(`${userUid} user connected`);

  // Listen for chat messages
  socket.on('chat message', (msg) => {
    console.log('msg: ', msg);
    io.emit('chat message', msg); // Broadcast the message to all connected clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    
    console.log(`${userUid} user disconnected`);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
