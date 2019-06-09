const app = require('../src/app');

// Import transform files
require('./crtSh/ToHash');
require('./crtSh/ToCrtShID');
require('./crtSh/ToIssuer');
require('./crtSh/ToSubjectNames');
require('./crtSh/ToSerial');

try {
  const discoveryHandler = require('./discovery');
  console.log('Imported discovery handler.');
  app.config.useHttps = true;
  app.koaApp.use((ctx, next) => discoveryHandler(ctx, next, app));
  console.log(app.koaApp.use);
} catch (e) {
  // pass
}

app.config.author = 'ABWalters';
app.config.owner = 'ABWalters';

app.run();
