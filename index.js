const Koa = require('koa')
const publicDir = require('./middlewares/public');
const render = require('./lib/render');
const routers = require('./route');
const SinalServer = require('./sinal-server');

new SinalServer();

const app = new Koa();

app.use(publicDir('style'));
app.use(publicDir('scripts'))

app.use(render);
app.use(routers.routes());

app.listen(4000);