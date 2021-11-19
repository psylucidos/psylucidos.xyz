require('dotenv').config();

const serve = require('koa-static');
const hook = require('server-hook');
const Koa = require('koa');
const app = new Koa();

hook.init({ // initialise hook
  target: 'http://status.psylucidos.xyz:3001/api',
  projectName: 'test',
  interval: 60,
})

app.on('error', err => {
  hook.errLog(err);
});

app
  .use(async (ctx, next) => {
    // create simple response time recorder
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    hook.request(ms); // update hook
  })
  .use(serve(__dirname + '/static/'));

app.listen(3000);
hook.setStatus('Online');
console.log('listening on port 3000');
