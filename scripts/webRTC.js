
function createPeerConnection() {
    global.myPeerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'turn:' + global.host, username: 'webrtc', credential: 'turnserver' }],
    });
    global.myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
}

function handleNegotiationNeededEvent() {
    global.myPeerConnection.createOffer()
        .then(setLocalDescription)
        .then(sendToServer)
        .catch(function(error) { console.log('create offer errror: ', error) });
}

function setLocalDescription(offer) {
    return global.myPeerConnection.setLocalDescription(offer);
}

function sendToServer() {
    global.socket.send(JSON.stringify({
        name: global.myName,
        type: 'video-offer',
        sdp: global.myPeerConnection.localDescription,
    }));
}