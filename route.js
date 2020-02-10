const Router = require('koa-router');

const router = new Router();

router.get('/', home);

async function home(ctx) {
    await ctx.render('index');
}

module.exports = router;