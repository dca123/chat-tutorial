const { Socket } = require('dgram');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
const liveUsers = []
const liveUsersSockets = []
io.on('connection', (socket) => {
    let stateUsername = ""
    socket.on('disconnect', () => {
        io.emit('chat message', `${stateUsername} has left to the chatroom.`)
        liveUsers.splice(liveUsers.indexOf(stateUsername), 1);
        io.emit('user connect', liveUsers)
        const names = liveUsersSockets.map(d => d[0])
        const nameID = names.indexOf(stateUsername)
        liveUsersSockets.splice(nameID, 1)
    })
    socket.on('chat message', (msg, username) => {
        socket.broadcast.emit('chat message', `${username}: ${msg}`)
    })
    socket.on('user connect', (username) => {
        io.emit('chat message', `${username} has connected to the chatroom.`)
        liveUsers.push(username)
        liveUsersSockets.push([username, socket])
        io.emit('user connect', liveUsers)
        stateUsername = username;
    })
    socket.on('chat input', (username) => {
        socket.broadcast.emit('chat input', `${username} is typing ...`)
    })
    socket.on('dm', (dm, message) => {
        const names = liveUsersSockets.map(d => d[0])
        const nameID = names.indexOf(dm)
        liveUsersSockets[nameID][1].emit('dm', `DM from ${stateUsername}: ${message}`)

    })

})
http.listen(process.env.PORT || 3000, () => {
    console.log('Listening on http://localhost:3000');
})