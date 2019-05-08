const LocalSerializer = require('./deserializers/localSerializer');
const XMLSerializer = require('./serializers/XMLSerializer');
const Response = require('./containers/Response');
const documentTransforms = require('./commands/document');
const { getTransformDisplay } = require('./utils');
const getKoaApp = require('./server/koaApp');
const startServer = require('./server/startServer');

const commands = ['list', 'document'];

const defaultConfig = {
  port: 3000,
  useHttps: false,
  author: 'Anon',
  owner: 'Anon'
};

class App {
  constructor(userConfig) {
    this.transforms = {};

    this.transform = this.transform.bind(this);
    this.run = this.run.bind(this);
    this.runLocalTransform = this.runLocalTransform.bind(this);
    this.isLocal = this.isLocal.bind(this);
    this.isCommand = this.isCommand.bind(this);

    this.config = { ...defaultConfig, ...userConfig };

    this.koaApp = getKoaApp();
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

  /**
   * Generate transform name from input and output types in config.
   * @param config
   * @return {never|string}
   */
  static getTransformName(config) {
    const { name, inputType, outputType } = config;

    if (name) {
      return name;
    }
    if (inputType && outputType) {
      const inputTypeStr = inputType().type;
      const outputTypeStr = outputType().type;

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
    if (transformName !== undefined &&
      this.transforms.hasOwnProperty(transformName)) {
      return true;
    }
    console.log('Project not being run as local transform.');
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
    startServer(this.koaApp, this.config);
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
    this.executeTransform(transformFunc, request).
      then(xmlStr => console.log(xmlStr));
  }

  executeTransform(transformFunc, request) {
    const response = new Response();
    const transformPromise = transformFunc(request, response);
    return transformPromise.then(() => {
      // console.log('Transform finished!');
      // console.log(response);
      const xmlStr = XMLSerializer.serializeResponse(response);
      // console.log(xmlStr);
      return xmlStr;
    }).catch(err => {
      console.log('Caught transform error');
      console.log(err);
    });
  }
}

const app = new App();

module.exports = app;
