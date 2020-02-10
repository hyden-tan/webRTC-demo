const ws = require('ws');

module.exports = class SinalServer {
  socket;

  socketPool = [];

  constructor() {
    this.socket = new ws.Server({
      host: '0.0.0.0',
      port: 1234,
    }, () => console.log(`ws://0.0.0.0:1234 worked`));

    this.socket.on('connection', this.handleConnection);
  }

  handleConnection = (clientSocket) => {
    if (this.socketPool.findIndex((item) => item.ws === clientSocket) === -1) {
      this.socketPool.push({ ws: clientSocket, name: '' });
    }

    clientSocket.on('message', (data) => {
      this.onMessage(JSON.parse(data), clientSocket);
    });
    clientSocket.send('connected');
  }

  onMessage = (data, client) => {
    switch(data.type) {
        case 'set-name': 
            this.setName(data.name, client);
        default: 
          this.exchangeSinal(data);
          break;
    } 
  }

  setName = (name, client) => {
    if (!name) {
        client.send(JSON.stringify({ type: 'set-name-faild', msg: '姓名为空！' }));
        return;
    }

    if (this.socketPool.find((item) => item.name === name) !== undefined) {
        client.send(JSON.stringify({ type: 'set-name', success: false, msg: '设置名称重复' }));
        return;
    }

    this.socketPool.forEach(item => {
      if (item.ws === client) {
        item.name = name;
      }
    })

    client.send(JSON.stringify({ type: 'set-name', success: true, name }));
    
    const clients = this.socketPool.map((client) => client.name)
      .filter((clientName) => !!clientName);

    if (clients.length > 0) {
        this.socketPool.forEach((item) => {
            item.ws.send(JSON.stringify({
                type: 'new-clients',
                clients,
            }));
        })
    }
  }

  exchangeSinal = (data) => {
    this.socketPool.forEach((item) => {
        if (item.name === data.targetUserName) {
          item.ws.send(JSON.stringify(data));
        }
    });
  }
}