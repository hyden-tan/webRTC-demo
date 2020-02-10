const Router = require('koa-router');

const router = new Router();

router.get('/', home);

function home(ctx) {
  return Promise.resolve(ctx.render('index'));
}

module.exports = router;