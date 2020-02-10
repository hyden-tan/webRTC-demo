import ws from 'ws';

export default class SinalServer {
  socket: ws.Server;

  socketPool: Array<{ name: string, ws: ws }> = [];

  constructor() {
    this.socket = new ws.Server({
      host: '0.0.0.0',
      port: 8080,
    }, () => console.log(`ws://192.168.0.102:8080 worked`));

    this.socket.on('connection', this.handleConnection);
  }

  handleConnection = (clientSocket: ws) => {
    if (this.socketPool.findIndex((item: any) => item.ws === clientSocket) === -1) {
      this.socketPool.push({ ws: clientSocket, name: '' });
    }

    clientSocket.on('message', (data: string) => {
      this.onMessage(JSON.parse(data), clientSocket);
    });
    clientSocket.send('connected');
  }

  onMessage = (data: any, client: ws) => {
    switch(data.type) {
        case 'set-name': 
            this.setName(data.name, client);
        default: 
          this.exchangeSinal(data);
          break;
    } 
  }

  setName = (name: string, client: ws) => {
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
      .filter((clientName: string) => !!clientName);

    if (clients.length > 0) {
        this.socketPool.forEach((item) => {
            item.ws.send(JSON.stringify({
                type: 'new-clients',
                clients,
            }));
        })
    }
  }

  exchangeSinal = (data: any) => {
    this.socketPool.forEach((item) => {
        if (item.name === data.targetUserName) {
          item.ws.send(JSON.stringify(data));
        }
    });
  }
}