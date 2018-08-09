import Koa from 'koa';
import publicDir from './middlewares/public';
import render from './lib/render';
import router from './route';
import socket from './websocket';

const useSocket = socket;

const app = new Koa();

app.use(publicDir('style'));
app.use(publicDir('scripts'))

app.use(render);
app.use(router.routes());

app.listen(4000);