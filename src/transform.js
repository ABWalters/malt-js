import Response from './containers/Response';
import XMLSerializer from './serializers/XMLSerializer';

let nameConfigMap; // Map transformName -> transformConfig
let nameFuncMap; // Map transformName -> transformFunc

export function getNameConfigMap() {
  if (!nameConfigMap) {
    nameConfigMap = {};
  }
  return nameConfigMap;
}

export function getNameFuncMap() {
  if (!nameFuncMap) {
    nameFuncMap = {};
  }
  return nameFuncMap;
}

/**
 * Get display based off of transform name
 * @param config
 * @return {string}
 */
function getTransformDisplay(config) {
  const typeParts = config.outputType().type.split('.');
  const typeStr = typeParts[typeParts.length - 1];
  const startDisplay = `To ${config.nameSuffix ? ` ${config.nameSuffix} ` : ''}${typeStr}`;
  return startDisplay;
}

function getTypeWithoutNamespace(entityType) {
  return entityType.split('.', 2)[1]; // TODO: Error handling for no namespace.
}

function getTransformName(config) {
  const { name, inputType, outputType } = config;

  if (name) {
    return name;
  }
  if (inputType && outputType) {
    const inputTypeStr = inputType().type;
    const outputTypeStr = outputType().type;

    const baseName = `${getTypeWithoutNamespace(inputTypeStr)}-To-${getTypeWithoutNamespace(
      outputTypeStr
    )}`;

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

/**
 * Common function called for both local and server transforms to execute the transform.
 *
 * Error catching should be done here.
 *
 * @param transformFunc
 * @param request
 * @return {Q.Promise<any>}
 */
export function executeTransform(transformFunc, request) {
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

/**
 * Low level function used to register a new transform
 *
 * @param {function} transformFunc - Function receiving request and response objects, that runs the transforms
 * @param {object} config - Config object used to store data about the transform
 */
export function transform(transformFunc, config) {
  if (!config.display) {
    config.display = getTransformDisplay(config);
  }
  const name = getTransformName(config);

  getNameConfigMap()[name] = config;
  getNameFuncMap()[name] = transformFunc;
}

/**
 * Register a transform with simple data fetching logic.
 */
export function basicTransform() {}
