const https = require('https');
const sslConfig = require('./sslConfig');

function startServer(koaApp, config) {
  const { port, useHttps } = config;
  console.log(
    `Starting transform server: port=${port}, https=${useHttps}`);
  if (!useHttps) {
    // Start the default koa server
    this.koaApp.listen(port);
  } else {
    // Manually start node https listener
    try {
      const httpsServer = https.createServer(sslConfig, koaApp.callback());
      httpsServer.listen(port, err => {
        if (err) {
          console.error('HTTPS server FAIL: ', err, err && err.stack);
        }
      });
    } catch (ex) {
      console.error('Failed to start HTTPS server\n', ex, ex && ex.stack);
    }
  }
}

module.exports = startServer;
