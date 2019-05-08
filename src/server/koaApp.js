const Koa = require('koa');
const querystring = require('querystring');
const xmlParser = require('koa-xml-body');
const XMLDeserializer = require('../deserializers/XMLDeserializer');

/**
 * Handler used when a 'run transform' request is received.
 */
async function runHandler(ctx, next) {
  const { request: { url } } = ctx;
  const urlParts = url.split('?');
  const path = urlParts[0];
  const queryString = urlParts[1];
  const query = querystring.parse(queryString);
  console.log('koaApp.js', path, query);
  if (
    path === '/run/' &&
    query.Command === '_RUN' &&
    query.TransformToRun &&
    this.transforms.hasOwnProperty(query.TransformToRun)
  ) {
    console.log(`Run Transform: ${query.TransformToRun}`);
    const r = XMLDeserializer.serialize(ctx.request.body);
    const transformResp = this.executeTransform(
      this.transforms[query.TransformToRun].func, r);
    ctx.body = await transformResp;
  }
  next();
}

/**
 * Return a Koa app instance to be used to run a server transform.
 */
function getKoaApp() {
  const koaApp = new Koa(); // TODO: Look at performance overhead
  koaApp.use(xmlParser());
  koaApp.use(runHandler);
  return koaApp;
}

module.exports = getKoaApp;

