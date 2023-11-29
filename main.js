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

const users = [
    // { id: "uuid", socketId: "", userName: "xxx" }
];

// Socket.io connection handling
io.on('connection', (socket) => {
    const userUid = uuidV4();
    // console.log(`${userUid} user connected`);
    // console.log(`${socket.id} user connected`);

    function createUser(){
        users.push(
            { id: userUid, socketId: socket.id, userName: null }
        );
    }
    createUser();
    
    function findUser(id){
        const resUser = users.find(user => user.id === id);
        return resUser;
    }

    function setNameUser(id, name){
        const idxUser = users.findIndex(user => user.id === id);
        users[idxUser].userName = name;
        return users[idxUser];
    }

    function getNameUser(id){
        const resUser = users.find(user => user.id === id);
        return resUser.userName;
    }

    // Listen for chat messages
    socket.on('chat message', (msg) => {
        const user = findUser(userUid)
        if(!user?.userName){
            setNameUser(userUid, msg.userName);
        }

        // userInfo
        // console.log('user: ', user);
        io.emit('chat message', { ...msg, userId: user.id }); // Broadcast the message to all connected clients
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`${userUid} user disconnected`);
    });
});

// app.get('/', (req, res) =>{

// });

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
