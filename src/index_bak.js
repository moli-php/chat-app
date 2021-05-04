const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const Filter = require('bad-words');
const { generateLocation, generateMsg } = require('../utils/message')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

/*
socket.emit // to specific client
socket.broadcast.emit // to all clients except the user
io.emit // to all clients 

socket.broadcast.to.emit // emit to everybody into specific room except the user
io.to.emit // emit everybody into specific room

*/


io.on('connection', (socket) => {
    console.log('io connection')

    

    // socket.on('join', ({username, room}) => {
    //     socket.join(room)
    //     socket.emit('triggermessage', generateMsg('Welcome'))
    //     socket.emit('triggermessage', generateMsg(username))
    //     console.log(username, room)

    // })

    socket.on('join', ({ username, room }) => {
        socket.join(room)

        socket.emit('triggermessage', generateMsg('Welcome!', username))
        socket.broadcast.to(room).emit('triggermessage', generateMsg(`has joined!`, username))

        socket.on('sendMessage', (message, callback) => {

            const filter = new Filter();
            if (filter.isProfane(message)) {
                return callback('Profanity is not allowed')
            }
            io.to(room).emit('triggermessage', generateMsg(message, username))
            // io.emit('triggermessage', generateMsg(message))
            callback()
        })

        socket.on('sendLocation', (location, callback) => {
            io.emit('triggerLocation', generateLocation(location, username))
            callback('location received')
        })
    
        socket.on('disconnect', () => {
            io.emit('triggermessage', generateMsg('A user has left', username))
        })

    })

    // socket.broadcast.emit('triggermessage', generateMsg('A new user has joined!'))

    // socket.on('sendMessage', (message, callback) => {

    //     const filter = new Filter();
    //     if (filter.isProfane(message)) {
    //         return callback('Profanity is not allowed')
    //     }
    //     io.emit('triggermessage', generateMsg(message))
    //     callback()
    // })

    // socket.on('sendLocation', (location, callback) => {
    //     io.emit('triggerLocation', generateLocation(location))
    //     callback('location received')
    // })

    // socket.on('disconnect', () => {
    //     io.emit('triggermessage', generateMsg('A user has left'))
    // })
})




server.listen(port, () => {
    console.log('listening to port ' + port)
})
