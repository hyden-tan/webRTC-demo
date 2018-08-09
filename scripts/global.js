window.global = {
    myName: '',
    host: location.hostname,
    socket: null,
    myPeerConnection: null,
    mediaConstraints: { audio: true, video: true },
    userPool: [],
};

function setName() {
    var name = document.getElementById('nameInput').value;

    if (name) {
        global.socket.send(JSON.stringify({
            type: 'set-name',
            name: name,
        }));
    }
}

function hangUp() {
    var callee = document.getElementById('friendsSelect').value;

    if (callee) {
        
    }
}