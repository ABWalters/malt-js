import Koa from 'koa';
import querystring from 'querystring';
import xmlParser from 'koa-xml-body';
import XMLDeserializer from '../deserializers/XMLDeserializer';
import { executeTransform, getNameFuncMap } from '../transform';

/**
 * Handler used when a 'run transform' request is received.
 */
async function runHandler(ctx, next) {
  const {
    request: { url }
  } = ctx;
  const urlParts = url.split('?');
  const path = urlParts[0];
  const queryString = urlParts[1];
  const query = querystring.parse(queryString);
  console.log('koaApp.js', path, query);

  const nameFuncMap = getNameFuncMap();

  console.log(nameFuncMap);

  if (
    path.startsWith('/run') &&
    query.Command === '_RUN' &&
    query.TransformToRun &&
    nameFuncMap.hasOwnProperty(query.TransformToRun)
  ) {
    console.log(`Run Transform: ${query.TransformToRun}`);
    const r = XMLDeserializer.serialize(ctx.request.body);
    const transformResp = executeTransform(nameFuncMap[query.TransformToRun], r);
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

export default getKoaApp;
