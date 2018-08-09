global.socket = new WebSocket('ws://localhost:8080');
global.socket.addEventListener('open', () => console.log('websocket connected'));
global.socket.addEventListener('message', receiveMessage);
global.socket.addEventListener('close', socketClose);

function receiveMessage(message) {
    const data = message.data;
    switch(data.type) {
        case 'set-name-success': 
            setNameResult(false, data.name);
            break;
        case 'set-name-faild':
            setNameResult(data.msg);
            break;
        default: 
            break;
    }
}

function socketClose(data) {
    console.log('close');
}

function setNameResult(err, name) {
    if (err) {
        alert(err);
    } else {
        global.myName = name;
    }
}