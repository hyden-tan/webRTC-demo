import Koa from 'koa';
import publicDir from './middlewares/public';
import render from './lib/render';
import routers from './route';
import SinalServer from './sinal-server';

new SinalServer();

const app = new Koa();

app.use(publicDir('style'));
app.use(publicDir('webrtc-share'))

app.use(render);
app.use(routers.routes());

app.listen(4000);