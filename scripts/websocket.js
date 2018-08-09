global.socket = new WebSocket('ws://10.10.9.76:8080');
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
        case 'set-name-success': 
            setNameResult(false, data.name);
            break;
        case 'set-name-failed':
            setNameResult(data.msg);
            break;
        case 'update-clients-list':
            updateClients(data.clients);
            break;
        case 'error': 
            console.warn(data.msg);
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
        document.getElementById('name').innerHTML = global.myName;
        document.getElementById('nameDiv').style.display = 'none';
    }
}

function updateClients(clients) {
    console.log(clients);
    var html = clients
        .fileter((client) => client !== global.myName)
        .map(client => `<option value="${client}">${client}</option>`)
        .join('');
    document.getElementById('friendsSelect').innerHTML = html;
}