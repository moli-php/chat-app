const socket = io();

//Elements
const $sendBtn = document.querySelector('#send')
const $locationBtn = document.querySelector('#get_location')
const $messageInput = document.querySelector('input')
const $messageContainer = document.querySelector('#msg-container')
const $roomContainer = document.querySelector('#room-container')

//Templates
const $msgTemplate = document.querySelector('#msg-tpl').innerHTML
const $locationTemplate = document.querySelector('#location-tpl').innerHTML
const $roomTemplate = document.querySelector('#room-tpl').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('triggermessage', ({message, createdAt, username}) => {
    console.log(message, username)
    // moment(message.createdAt).format('h:mm a')
    const html = Mustache.render($msgTemplate, {message, createdAt:moment(createdAt).format('h:m a'), username})
    $messageContainer.insertAdjacentHTML('beforeend', html)
})
socket.on('triggerLocation', ({location, createdAt, username}) => {
    const url = `https://google.com/maps?q=${location.long},${location.lat}`
    const html = Mustache.render($locationTemplate, {url, createdAt:moment(createdAt).format('h:m a'), username})
    $messageContainer.insertAdjacentHTML('beforeend', html)
})
socket.on('roomUsersList', ({users, room}) => {
    console.log(users, room)
    const html = Mustache.render($roomTemplate, {users, room})
    $roomContainer.innerHTML = html
})




$sendBtn.addEventListener('click', () => {

    socket.emit('sendMessage',  $messageInput.value, (error) => {
        if (error) {
            console.log(error)
        }
        $messageInput.value = ""
        $messageInput.focus()
    })
})

$locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    $locationBtn.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {

        const location = {long: position.coords.longitude, lat: position.coords.latitude }
        socket.emit('sendLocation', location, (callback) => {
            console.log(callback)
            $locationBtn.removeAttribute('disabled')
        })
    })
})

socket.emit('join', {username, room}, callbackError => {
    console.log(callbackError)
    if (callbackError) {
        alert(callbackError)
    }
})

