const app = require('express')();
const { ExpressPeerServer } = require('peer');
const http = require('http').Server(app);
const peerServer = ExpressPeerServer(http, {
    debug: true
})
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

app.use('/peerjs', peerServer);

io.on('connection', (socket) => {
    /* Below event share socket id */
    io.to(socket.id).emit('your-sock-id', socket.id);
    console.log('User Connected : ' + socket.id);

    /* Below event exchange the ID Set */
    socket.on('connect-request', (pin) => {
        console.log('Connect-Request : ' + pin);
        socket.broadcast.emit('request-to-connect', pin);
    })

    /* Below will notify if user disconnects */
    socket.on('disconnect', () => {
        console.log('User Disconnected');
    })
})

http.listen(process.env.PORT || 3000, () => console.log('Listening : 3000'));