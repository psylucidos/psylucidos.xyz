require('dotenv').config();

const serve = require('koa-static');
const hook = require('server-hook');
const Koa = require('koa');
const app = new Koa();

hook.init({ // initialise hook
  target: process.env.HOOKTARGET,
  projectName: process.env.HOOKNAME,
  interval: process.env.HOOKINTERVAL,
})

app.on('error', err => {
  hook.logErr(err);
});

app
  .use(async (ctx, next) => {
    // if request is for a page (not css/js file)
    if (ctx.path.includes('.html') || ctx.path[ctx.path.length - 1] === '/') {
      // record response time
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      hook.request(ms); // update hook
    } else {
      await next();
    }
  })
  .use(serve(__dirname + '/static/')); //serve static files

app.listen(3000);
hook.setStatus('Online');
console.log('listening on port 3000');
