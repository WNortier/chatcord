const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');
//Get username and room from URL

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom

socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({room, users}) => {
    console.log(room)
    outputRoomName(room);
    outputUsers(users);
});


// Message from server
socket.on('message', message => {
    //console.log(message);
    outputMessage(message);
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    // Preventing form from automatically submitting to a file
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    // Emit message to server
    socket.emit('chatMessage', msg)
    //Scroll down

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
    
});

//Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add room name to Dom
function outputRoomName(room) {
    console.log(room)
    roomName.innerText = room;
}

// Add users to Dom 
function outputUsers(users) {
    console.log(users)
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}