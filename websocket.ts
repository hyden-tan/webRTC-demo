import ws from 'ws';

const socketPool: any[] = [];
const socket: any = new ws.Server({
        host: '0.0.0.0',
        port: 8080,
    }, () => console.log(`ws://${socket.address().address}:8080 worked`));

socket.on('connection', (clientSocket: ws) => { 
    if (socketPool.findIndex((item: any) => item.ws === clientSocket) === -1) {
        socketPool.push({ ws: clientSocket });
    }

    clientSocket.on('message', (data: string) => onMessage.call(undefined, JSON.parse(data), clientSocket));
    clientSocket.send('connected');
});

function onMessage(data: any, client: ws) {
    switch(data.type) {
        case 'set-name': 
            setName(data.name, client);
        case 'video-offer':
            setOffer(data);
        default: 
            break;
    } 
}

function setName(name: string, client: ws) {
    if (!name) {
        client.send(JSON.stringify({ type: 'set-name-faild', msg: '姓名为空！' }));
        return;
    }

    if (socketPool.indexOf((item: any) => item.name === name) !== -1) {
        client.send(JSON.stringify({ type: 'set-name-failed', msg: '名称已重复，请重新设置！' }));
        return;
    }
    
    let item = socketPool.find((item: any) => item.ws === client);
    if (item) {
        item.name = name;
    } else {
        item = { name, ws: client };
    }
    
    client.send(JSON.stringify({ type: 'set-name-success', name }));
    
    const clients = socketPool.map((client: any) => client.name).filter((clientName: string | undefined) => !!clientName);

    if (clients.length > 0) {
        socketPool.forEach((item: any) => {
            item.ws.send(JSON.stringify({
                type: 'update-clients-list',
                clients,
            }));
        })
    }
}

function setOffer(data: any) {
    socketPool.forEach((item: any, index: number) => {
        if (item.name === data.name) {
            socketPool[index].sdp = data.sdp;
        }
    });
}

export default socket;