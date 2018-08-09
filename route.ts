import Router from 'koa-router';

const router = new Router();

router.get('/', home);

async function home(ctx: any) {
    await ctx.render('index');
}


export default router;
 