import fs from 'fs';
import path from 'path';

const fsPromises = fs.promises;
const root = process.cwd();

export default (publicPath: string) => async (ctx: any, next: any) => {
    if (ctx.path.indexOf(publicPath) === 1) {
        if (/.css$/.test(ctx.path)) {
            ctx.type = 'text/css';
        }


        ctx.body = await fsPromises.readFile(path.join(root, ctx.path), { encoding: 'utf8' });
    }

    await next();
}
