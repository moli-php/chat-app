const generateMsg = (message, username = null) => {
    return {
        username,
        message,
        createdAt: new Date().getTime()
    }
}

const generateLocation = (location, username = null) => {
    return {
        username,
        location,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMsg,
    generateLocation
}