global.socket = new WebSocket('ws://192.168.1.23:8080');
global.socket.addEventListener('open', createPeerConnection);
global.socket.addEventListener('message', receiveMessage);
global.socket.addEventListener('close', socketClose);

function receiveMessage(message) {
    let data;
    try {
        data = JSON.parse(message.data);
    } catch (e) {
        data = { type: 'error', msg: message.data + ' is not a json string!' };
    }

    switch(data.type) {
        case 'set-name': 
            setNameResult(data);
            break;
        case 'new-clients':
            updateClients(data.clients);
            break;
        default: 
            break;
    }
}

function socketClose(data) {
    console.log('close');
}

