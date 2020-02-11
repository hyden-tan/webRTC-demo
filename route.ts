import Router from 'koa-router';

const router = new Router();

router.get('/', home);
router.get('/webrtc-share', home);

async function home(ctx: any) {
    await ctx.render('index');
}

export default router;