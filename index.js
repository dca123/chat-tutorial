const { Socket } = require('dgram');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
io.on('connection', (socket, username) => {
    socket.on('disconnect', () => {
        io.emit('chat message', `${username} has left to the chatroom.`)
    })
    socket.on('chat message', (msg, username) => {
        socket.broadcast.emit('chat message', `${username}: ${msg}`)
    })
    socket.on('user connect', (username) => {
        io.emit('chat message', `${username} has connected to the chatroom.`)
    })

})
http.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
})