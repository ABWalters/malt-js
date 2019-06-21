import documentTransforms from './commands/document';
import LocalSerializer from './deserializers/localSerializer';
import getKoaApp from './server/koaApp';
import { executeTransform, getNameConfigMap } from './transform';

const commands = ['list', 'document'];

class Server {
  constructor(meta, config) {
    this.run = this.run.bind(this);
    this.runLocalTransform = this.runLocalTransform.bind(this);
    this.isLocal = this.isLocal.bind(this);
    this.isCommand = this.isCommand.bind(this);

    this.config = config;
    this.meta = meta;

    this.koaApp = getKoaApp();
  }

  /**
   * Method called for discovery to list the transforms that the server has available.
   */
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
    // eslint-disable-next-line no-unused-vars
    const [nodePath, workDir, transformName, ...maltegoArgs] = process.argv;
    if (transformName !== undefined && this.transforms.hasOwnProperty(transformName)) {
      return true;
    }
    console.log('Project not being run as local transform.');
    return false;
  }

  isCommand() {
    // eslint-disable-next-line no-unused-vars
    const [nodePath, workDir, command] = process.argv;
    return !!(command && commands.indexOf(command) > -1);
  }

  run() {
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
    } else if (command === 'document') {
      console.log('Document');
      documentTransforms(this.transforms);
    }
  }

  runLocalTransform() {
    // eslint-disable-next-line no-unused-vars
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
    app = new Server(meta, config);
  } else {
    console.log('Warning: Server already initialised.');
  }
  return app;
}

export default server;
