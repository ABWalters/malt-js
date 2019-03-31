const Koa = require('koa');
const LocalSerializer = require('./deserializers/localSerializer');
const XMLSerializer = require('./serializers/XMLSerializer');
const Response = require('./containers/Response');
const documentTransforms = require('./commands/document');
const getTransformDisplay = require('./utils').getTransformDisplay;
const querystring = require('querystring');
const xmlParser = require('koa-xml-body')
const XMLDeserializer = require('./deserializers/XMLDeserializer');

const commands = ['list', 'document'];

class App {
  constructor() {
    this.transforms = {};

    this.transform = this.transform.bind(this);
    this.run = this.run.bind(this);
    this.runLocalTransform = this.runLocalTransform.bind(this);
    this.isLocal = this.isLocal.bind(this);
    this.isCommand = this.isCommand.bind(this);

    this.koaApp = new Koa(); // TODO: Look at performance overhead
    this.koaApp.use(xmlParser());
    this.koaApp.use(async ctx => {
      const { request } = ctx;
      const { url } = request;
      const urlParts = url.split('?');
      const path = urlParts[0];
      const queryString = urlParts[1];
      const query = querystring.parse(queryString);
      console.log('App.js', path, query);
      if (
        path === '/run/' &&
        query.Command === '_RUN' &&
        query.TransformToRun &&
        this.transforms.hasOwnProperty(query.TransformToRun)
      ) {
        console.log('Should run transforms');
        const r = XMLDeserializer.serialize(ctx.request.body);
        const transformresp = this.executeTransform(this.transforms[query.TransformToRun].func, r);
        // console.log(resp);
        ctx.body = await transformresp;
      }
    });
  }

  getKoaApp() {
    return this.koaApp;
  }

  transform(config, func) {
    if (!config.display) {
      config.display = getTransformDisplay(config);
    }
    this.transforms[this.getTransformName(config)] = { func, config };
  }

  getTransformName(config) {
    if (config.name) {
      return name;
    }
    if (config.inputType && config.outputType) {
      const inputTypeStr = config.inputType().type;
      const outputTypeStr = config.outputType().type;

      const baseName = `${App.getTypeWithoutNamespace(
        inputTypeStr
      )}-To-${App.getTypeWithoutNamespace(outputTypeStr)}`;

      if (config.nameSuffix) {
        return `${baseName}-${config.nameSuffix}`;
      }
      return baseName;
    }
    console.log(
      'Error: You need to either specify a transform name, or specify the inputType AND outputType.'
    );
    return 'invalid-name-config';
  }

  static getTypeWithoutNamespace(entityType) {
    return entityType.split('.', 2)[1]; // TODO: Error handling for no namespace.
  }

  isLocal() {
    const [nodePath, workDir, transformName, ...maltegoArgs] = process.argv;
    if (transformName === undefined || maltegoArgs.length === 0) {
      return false;
    }
    if (this.transforms.hasOwnProperty(transformName)) {
      return true;
    }
    return false;
  }

  isCommand() {
    const [nodePath, workDir, command] = process.argv;
    return !!(command && commands.indexOf(command) > -1);
  }

  isServer() {
    const [nodePath, workDir, command] = process.argv;
    if (command === undefined) {
      return true;
    }
    return false;
  }

  startServer() {
    console.log('Starting transform server.');
    this.koaApp.use(async ctx => {
      console.log('Internal middleware!');
      // console.log(ctx);
      // ctx.body = 'Hello World';
    });
    this.koaApp.listen(3000);
    console.log('Transform server is running on port 3000.');
  }

  use(listenerFunc) {
    if (this.koaApp) {
      this.koaApp.use(listenerFunc);
    } else {
      console.log(
        'Transform server not initialised. Make sure you call "startServer" before "use"'
      );
    }
  }

  run() {
    // console.log('Run called, args are: ', process.argv);
    // console.log('Available Transforms Are: ', Object.keys(this.transforms));
    if (this.isLocal()) {
      this.runLocalTransform();
    } else if (this.isCommand()) {
      this.runCommand();
    } else if (this.isServer()) {
      this.startServer();
    }
  }

  runCommand() {
    const [, , command] = process.argv;
    if (command === 'list') {
      // console.log(this.transforms);
      console.log('Available Transform Names:');
      console.log('==========================');
      Object.keys(this.transforms).forEach(key => console.log(key));
    } else if (command === 'document') {
      console.log('Document');
      documentTransforms(this.transforms);
    }
  }

  runLocalTransform() {
    const [nodePath, workDir, transformName, ...maltegoArgs] = process.argv;
    const request = LocalSerializer.serialize(maltegoArgs);
    const transformFunc = this.transforms[transformName];
    this.executeTransform(transformFunc, request).then(xmlStr => console.log(xmlStr));
  }

  executeTransform(transformFunc, request) {
    const response = new Response();
    const transformPromise = transformFunc(request, response);
    return transformPromise
      .then(() => {
        // console.log('Transform finished!');
        // console.log(response);
        const xmlStr = XMLSerializer.serializeResponse(response);
        // console.log(xmlStr);
        return xmlStr;
      })
      .catch(err => {
        console.log('Caught transform error');
        console.log(err);
      });
  }
}

const app = new App();

module.exports = app;
