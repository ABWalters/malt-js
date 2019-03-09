const LocalSerializer = require('./deserializers/localSerializer');
const XMLSerializer = require('./serializers/XMLSerializer');
const Response = require('./containers/Response');

class App {
  constructor() {
    this.transforms = {};

    this.transform = this.transform.bind(this);
    this.run = this.run.bind(this);
    this.runLocalTransform = this.runLocalTransform.bind(this);
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
    }
  }

  getTypeWithoutNamespace(entityType) {
    return entityType.split('.', 2)[1]; // TODO: Error handling for no namespace.
  }

  run() {
    // console.log('Run called, args are: ', process.argv);
    // console.log('Available Transforms Are: ', Object.keys(this.transforms));
    if (true) {
      this.runLocalTransform();
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
