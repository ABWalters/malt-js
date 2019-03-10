const LocalSerializer = require('./deserializers/localSerializer');
const XMLSerializer = require('./serializers/XMLSerializer');
const Response = require('./containers/Response');

const commands = ['list'];

class App {
  constructor() {
    this.transforms = {};

    this.transform = this.transform.bind(this);
    this.run = this.run.bind(this);
    this.runLocalTransform = this.runLocalTransform.bind(this);
    this.isLocal = this.isLocal.bind(this);
    this.isCommand = this.isCommand.bind(this);
  }

  transform(config, func) {
    // console.log(config);
    // console.log(func);
    this.transforms[this.getTransformName(config)] = func;
  }

  getTransformName(config) {
    if (config.name) {
      return name;
    } else if (config.inputType && config.outputType) {
      return `${this.getTypeWithoutNamespace(config.inputType)}-To-${this.getTypeWithoutNamespace(
        config.outputType
      )}`;
    } else {
      console.log(
        'Error: You need to either specify a transform name, or specify the inputType AND outputType.'
      );
      return 'invalid-name-config';
    }
  }

  getTypeWithoutNamespace(entityType) {
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
    console.log(process.argv);
    return !!(command && commands.indexOf(command) > -1);
  }

  run() {
    // console.log('Run called, args are: ', process.argv);
    // console.log('Available Transforms Are: ', Object.keys(this.transforms));
    if (this.isLocal()) {
      this.runLocalTransform();
    } else if (this.isCommand()) {
      this.runCommand();
    }
  }

  runCommand() {
    const [nodePath, workDir, command] = process.argv;
    if (command === 'list') {
      console.log(this.transforms);
    }
  }

  runLocalTransform() {
    const [nodePath, workDir, transformName, ...maltegoArgs] = process.argv;
    const request = LocalSerializer.serialize(maltegoArgs);
    const transformFunc = this.transforms[transformName];
    this.executeTransform(transformFunc, request);
  }

  executeTransform(transformFunc, request) {
    const response = new Response();
    const transformPromise = transformFunc(request, response);
    transformPromise
      .then(() => {
        // console.log('Transform finished!');
        // console.log(response);
        const xmlStr = XMLSerializer.serializeResponse(response);
        console.log(xmlStr);
        // return xmlStr;
      })
      .catch(console.log);
  }
}

const app = new App();

module.exports = app;
