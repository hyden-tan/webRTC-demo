const Router = require('koa-router');

const router = new Router();

router.get('/', home);
router.get('/webrtc-share', home);

async function home(ctx) {
    await ctx.render('index');
}

module.exports = router;