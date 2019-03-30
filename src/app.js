const LocalSerializer = require('./deserializers/localSerializer');
const XMLSerializer = require('./serializers/XMLSerializer');
const Response = require('./containers/Response');
const documentTransforms = require('./commands/document');

const commands = ['list', 'document'];

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
    this.transforms[this.getTransformName(config)] = { func, config };
  }

  getTransformName(config) {
    if (config.name) {
      return name;
    }
    if (config.inputType && config.outputType) {
      const inputTypeStr = config.inputType().type;
      const outputTypeStr = config.outputType().type;

      const baseName = `${this.getTypeWithoutNamespace(
        inputTypeStr
      )}-To-${this.getTypeWithoutNamespace(outputTypeStr)}`;

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
    const [, , command] = process.argv;
    if (command === 'list') {
      // console.log(this.transforms);
      console.log('Available Transform Names:');
      console.log('==========================');
      Object.keys(this.transforms).forEach(key => console.log(key));
    } else if (command === 'document'){
      console.log('Document');
      documentTransforms(this.transforms);
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
      .catch(err => {
        console.log('Caught transform error');
        console.log(err);
      });
  }
}

const app = new App();

module.exports = app;
