import Koa from 'koa';
import publicDir from './middlewares/public';
import SinalServer from './sinal-server';

new SinalServer();

const app = new Koa();

app.use(publicDir('webrtc-share'))

app.listen(4000);