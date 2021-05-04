const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const Filter = require('bad-words');
const { generateLocation, generateMsg } = require('../utils/message')
const { addUser, findUser, deleteUser, getUsersInRoom } = require('../utils/users')

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

    socket.on('join', (options, callback)  => {
        const {user, error } = addUser({id: socket.id, ...options})
        console.log(user, error)
        if (error) {
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('triggermessage', generateMsg('Welcome!', user.username))
        socket.broadcast.to(user.room).emit('triggermessage', generateMsg(`has joined!`, user.username))

        const roomUsers = getUsersInRoom(user.room);
        io.to(user.room).emit('roomUsersList',  {users: getUsersInRoom(user.room), room:user.room})
        callback()

    })

    // socket.broadcast.emit('triggermessage', generateMsg('A new user has joined!'))

    socket.on('sendMessage', (message, callback) => {
        const user = findUser(socket.id)
        if (!user) {
            return callback('No user')
        }

        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
        io.to(user.room).emit('triggermessage', generateMsg(message, user.username))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        const user = findUser(socket.id)

        io.to(user.room).emit('triggerLocation', generateLocation(location, user.username))
        callback('location received')
    })

    socket.on('disconnect', () => {
        const user = deleteUser(socket.id)
        if (!user) {
            return
        }
        io.to(user.room).emit('triggermessage', generateMsg(`has left`, user.username))
        io.to(user.room).emit('roomUsersList',  {users: getUsersInRoom(user.room), room:user.room})
    })
})




server.listen(port, () => {
    console.log('listening to port ' + port)
})
