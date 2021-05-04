const users = []

const addUser = ({id, username, room}) => {

    username = username.toLowerCase().trim()
    room = room.toLowerCase().trim()

    if (!username || !room) {
        return {
            error: 'Usernae and room are required!'
        }
    }

    const isJoinedUser = users.filter(user =>  user.username == username && user.room == room)
    const user = {id, username, room}

    if (isJoinedUser.length) {
        return {
            error: 'User already join'
        }
    }

    users.push(user)

    return {user}
}

const deleteUser = (id) => {
    const index = users.findIndex(user => user.id === id)
    if (-1 < index) {
        return users.splice(index, 1)[0]
    }
}

const findUser = (id) => {
    return users.find(user => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter(user => user.room === room)
}

module.exports = {
    addUser,
    deleteUser,
    getUsersInRoom,
    findUser
}


// addUser({id:1, username:'mmm', room:'agoo  '})
// addUser({id:2, username:'Gsebb', room:'AAAaa'})
// addUser({id:3, username:'Gsebb', room:'AAsAaa'})
// addUser({id:4, username:'moli', room:'agoo'})

// const {user, error } = addUser({id:5, username:'moli', room:'ago1o'})

// console.log(user, error)


// console.log(deleteUser(1))
// console.log(findUser(2))
// console.log(users)

// console.log(getUsersInRoom('agoo1'))




