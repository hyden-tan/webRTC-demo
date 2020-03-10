const SIGNAL_SERVER_WS_URL = 'wss://by.xinoa.cc/webrtc-share-ws';

window.global = {
    myName: '',
    targetUserName: '',
    host: location.hostname,
    userPool: [],
};

class Call {
    signalClient;
    peerConnection;

    constructor() {
        this.signalClient = new SignalClient({
          onVideoOffer: this.handleVideoOfferMsg,
          onVideoAnswerMsg: this.handleVideoAnswerMsg,
          onNewICECandidateMsg: this.handleNewICECandidateMsg,
        });
    }

    invite = () => {
        this.createPeerConnection();
        this.getUserMedia();
    }

    getUserMedia = () => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then((localStream) => {
                document.getElementById("video-local").srcObject = localStream;
                this.peerConnection.addStream(localStream);
            })
            .catch((error) => console.log(error));
    }

    createPeerConnection = () => {
        this.peerConnection = new RTCPeerConnection({
            // iceServers: [{ urls: 'turn:' + global.host, username: 'webrtc', credential: 'turnserver' }],
        });

        /**
         * @onnegotiationneeded
         * webRTC已准备好可以开始和对方协商，在这里生成一个offer发送给对方，请求对方连接
         *  */ 
        this.peerConnection.onnegotiationneeded = () => {
            this.peerConnection.createOffer()
                .then((offer) => this.peerConnection.setLocalDescription(offer))
                .then(() => {
                    this.signalClient.sendLocalDescription(this.peerConnection.localDescription);
                })
                .catch(function(error) { console.log('create offer errror: ', error) });
        }

        /**
         * @onicecandidate
         * 当需要你通过信令服务器将一个ICE候选发送给另一个对等端时
         */
        this.peerConnection.onicecandidate = (event) => {
          setTimeout(() => {
            if (event.candidate) {
              this.signalClient.sendMsg({
                type: "new-ice-candidate",
                targetUserName: global.targetUserName,
                candidate: event.candidate
              });
            }
          }, 2000);          
        };

        this.peerConnection.ontrack = (event) => {
          document.getElementById("video-remote").srcObject = event.stream;
        }
    }

    setLocalDescription = (offer) => {
        return this.peerConnection.setLocalDescription(offer);
    }

    handleVideoOfferMsg = (msg) => {
      console.log('receiveOffser');
    
      global.targetUserName = msg.name;
      this.createPeerConnection();
    
      const desc = new RTCSessionDescription(msg.sdp);
    
      this.peerConnection.setRemoteDescription(desc).then(function () {
        return navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      })
      .then((stream) => {
        console.log('add localstream');
        document.getElementById("video-local").srcObject = stream;
        this.peerConnection.addStream(stream);
    
        // localStream.getTracks().forEach(track => this.peerConnection.addTrack(track, localStream));
      })
      .then(() => {
        console.log('create ansser');
        return this.peerConnection.createAnswer();
      })
      .then((answer) => {
        return this.peerConnection.setLocalDescription(answer);
      })
      .then(() => {
        this.signalClient.sendMsg({
          name: global.myName,
          targetUserName: global.targetUserName,
          type: 'video-answer',
          sdp: this.peerConnection.localDescription
        });
      })
      .catch(function(error) { console.log('create answer errror: ', error) });
    }

    handleVideoAnswerMsg = (msg) => {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp)).catch(reportError);
    }

    handleNewICECandidateMsg = (msg) => {
      console.log('receiveIce');
      const candidate = new RTCIceCandidate({
        ...msg.candidate,
      });
    
      this.peerConnection.addIceCandidate(candidate)
        .catch(console.log);
    }
}

class SignalClient {
    socket;

    constructor({ onVideoOffer, onNewICECandidateMsg, onVideoAnswerMsg }) {
      this.onVideoOffer = onVideoOffer;
      this.onVideoAnswerMsg = onVideoAnswerMsg;
      this.onNewICECandidateMsg = onNewICECandidateMsg;

      this.socket = new WebSocket(SIGNAL_SERVER_WS_URL);
      this.socket.addEventListener('message', this.onMessage);
    }

    onMessage = (msgEvent) => {
      try {
        const msg = JSON.parse(msgEvent.data);
        switch (msg.type) {

          case 'video-offer':
            this.onVideoOffer(msg);
            break;

          case "video-answer":  // Callee has answered our offer
            this.onVideoAnswerMsg(msg);
            break;
    
          case 'new-ice-candidate':
            this.onNewICECandidateMsg(msg);


          case 'set-name': 
            setNameResult(msg);
            break;
          case 'new-clients':
            updateClients(msg.clients);
            break;
          default:
            break;
        }
      } catch (e) {
        console.log('occur an error:', e);
      }
    }

    sendMsg(message) {
        this.socket.send(JSON.stringify(message));
    }

    sendLocalDescription(description) {
        this.sendMsg({
            name: global.myName,
            targetUserName: global.targetUserName,
            type: 'video-offer',
            sdp: description,
        });
    }
}

const callInstance = new Call();

function setName() {
    var name = document.getElementById('nameInput').value;
    if (name) {
      callInstance.signalClient.sendMsg({ type: 'set-name', name: name });
    }
}

function setNameResult(data) {
  if (!data.success) {
      alert(data.msg);
  } else {
      global.myName = data.name;
      document.getElementById('name').innerHTML = global.myName;
      document.getElementById('nameDiv').style.display = 'none';
  }
}

function updateClients(clients) {
  var html = clients
      .filter((client) => client !== global.myName)
      .map(client => `<option value="${client}">${client}</option>`)
      .join('');
  document.getElementById('friendsSelect').innerHTML = html;
}

function startCall() {
    const target = document.getElementById('friendsSelect').value;

    if (!target) {
        alert('请选择外呼目标');
        return;
    }
    global.targetUserName = target;
    callInstance.invite();
}