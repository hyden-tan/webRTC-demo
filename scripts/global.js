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

    if (global.myName) {
        global.socket.send({
            type: 'set-name',
            name: name,
        });
    }
}