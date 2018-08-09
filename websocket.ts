import ws from 'ws';

const socketPool: any[] = [];
const socket = new ws.Server({
    host: 'localhost',
    port: 8080,
    }, () => console.log('ws://localhost:8080 worked'));

socket.on('connection', (clientSocket: ws) => { 
    if (socketPool.findIndex((item: any) => item.ws === clientSocket) !== -1) {
        socketPool.push({ ws: clientSocket });
    }

    clientSocket.on('message', (data: string) => onMessage.call(undefined, data, clientSocket));
    clientSocket.send('connected');
});

function onMessage(data: any, client: ws) {
    console.log(data);
    switch(data.type) {
        case 'set-name': 
            setName(data.name, client);
        default: 
            break;
    } 
}

function setName(name: string, client: ws) {
    if (!name) {
        client.send({ type: 'set-name-faild', msg: '姓名为空！' });
        return;
    }

    if (socketPool.indexOf((item: any) => item.name === name) !== -1) {
        client.send({ type: 'set-name-faild', msg: '名称已重复，请重新设置！' });
        return;
    }
    
    let item = socketPool.find((item: any) => item.ws === client);
    if (item) {
        item.name = name;
    } else {
        item = { name, ws: client };
    }
    client.send({ type: 'set-name-success', name });
    const clients = socketPool.map((item: any) => item.name).filter((item: string | undefined) => !!item);
    socketPool.forEach((item: any) => {
        item.ws.send({
            type: 'update-clients-list',
            clients,
        });
    })
}

export default socket;