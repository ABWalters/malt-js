const app = require('../src/app');

require('./crtSh/ToHash');
require('./crtSh/ToCrtShID');
require('./crtSh/ToIssuer');
require('./crtSh/ToSubjectNames');
require('./crtSh/ToSerial');

app.run();
