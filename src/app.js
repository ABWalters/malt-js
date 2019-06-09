import LocalSerializer from './deserializers/localSerializer';
import XMLSerializer from './serializers/XMLSerializer';
import Response from './containers/Response';
import documentTransforms from './commands/document';
import getKoaApp from './server/koaApp';
import startServer from './server/startServer';
import { executeTransform, getNameConfigMap } from './transform';

const commands = ['list', 'document'];

class App {
  constructor(meta, config) {
    this.run = this.run.bind(this);
    this.runLocalTransform = this.runLocalTransform.bind(this);
    this.isLocal = this.isLocal.bind(this);
    this.isCommand = this.isCommand.bind(this);

    this.config = {
      port: 3000,
      useHttps: false
    };

    this.meta = meta;

    this.koaApp = getKoaApp();
  }

  getTransforms() {
    const map = getNameConfigMap();

    const mergedMap = {}; // Merge in app.meta with the individual transform configs

    Object.keys(map).forEach(key => {
      const value = map[key];
      const mergedValue = { ...value, ...this.meta };
      mergedMap[key] = mergedValue;
    });

    return mergedMap;
  }

  isLocal() {
    const [nodePath, workDir, transformName, ...maltegoArgs] = process.argv;
    if (transformName !== undefined && this.transforms.hasOwnProperty(transformName)) {
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
    executeTransform(transformFunc, request).then(xmlStr => console.log(xmlStr));
  }
}

let app;

/**
 * Function used to initialise transform server.
 *
 * @param {Object} meta - Global meta used for the server.
 * @param {string} meta.author - Author of the transforms
 * @param {Object} config={} - Server config object.
 */
function server(meta, config = {}) {
  if (!app) {
    app = new App(meta, config);
  } else {
    console.log('Warning: Server already initialised.');
  }
  return app;
}

export default server;
