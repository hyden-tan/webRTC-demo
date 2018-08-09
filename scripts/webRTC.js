global.onnegotiationneeded = handleNegotiationNeededEvent;

function createPeerConnection() {
    global.myPeerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'turn:' + global.host, username: 'webrtc', credential: 'turnserver' }],
    });
}

function handleNegotiationNeededEvent() {
    global.myPeerConnection.createOffer().then(function(offer) {
        return global.myPeerConnection.setLocalDescription(offer);
    }).then(function() {
        sendToServer({
            name: global.myName,
            target: global.userPool[0],
            type: 'video-offer',
            sdp: myPeerConnection.localDescription,
        });
    }).catch(function(error) { console.log('create offer errror: ', error) });
}

function sendToServer(message) {

}