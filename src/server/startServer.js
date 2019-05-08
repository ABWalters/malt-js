const https = require('https');
const sslConfig = require('./sslConfig');

function startServer(koaApp, serverPort, useHttps) {
  console.log(`Starting transform server: port=${serverPort}, https=${useHttps}`);
  if (!useHttps) {
    // Start the default koa server
    this.koaApp.listen(3000);
  } else {
    // Manually start node https listener
    try {
      const httpsServer = https.createServer(sslConfig, koaApp.callback());
      httpsServer.listen(3000, err => {
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
