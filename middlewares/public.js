const fs = require('fs');
const path = require('path');

const fsPromises = fs.promises;
const root = process.cwd();

module.exports = (publicPath) => (ctx, next) => {
    if (ctx.path.indexOf(publicPath) === 1) {
        if (/.css$/.test(ctx.path)) {
            ctx.type = 'text/css';
        }


        ctx.body = fsPromises.readFile(path.join(root, ctx.path), { encoding: 'utf8' });
    }

    next();
}
