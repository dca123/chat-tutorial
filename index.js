const { Socket } = require('dgram');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
const liveUsers = []
io.on('connection', (socket) => {
    let stateUsername = ""
    socket.on('disconnect', () => {
        io.emit('chat message', `${stateUsername} has left to the chatroom.`)
        liveUsers.splice(liveUsers.indexOf(stateUsername), 1);
        io.emit('user connect', liveUsers)
    })
    socket.on('chat message', (msg, username) => {
        socket.broadcast.emit('chat message', `${username}: ${msg}`)
    })
    socket.on('user connect', (username) => {
        io.emit('chat message', `${username} has connected to the chatroom.`)
        liveUsers.push(username)
        io.emit('user connect', liveUsers)
        stateUsername = username;
    })
    socket.on('chat input', (username) => {
        socket.broadcast.emit('chat input', `${username} is typing ...`)
    })

})
http.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
})