const views = require('koa-views');
const path = require('path');

export default views(path.join(__dirname, '../views'), { map: { html: 'swig' } });