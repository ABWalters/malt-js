const app = require('../src/app');
const maltJSDiscovery = require('malt-js-discovery');

require('./crtSh/ToHash');
require('./crtSh/ToCrtShID');
require('./crtSh/ToIssuer');
require('./crtSh/ToSubjectNames');
require('./crtSh/ToSerial');

// app.use(maltJSDiscovery);
// app.run();
maltJSDiscovery(app);
