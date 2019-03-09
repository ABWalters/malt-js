const TRANSFORM_REGISTRY = {};

function transform(...args) {
  /*
    Decorator used to wrap a transform function.
   */
  console.log(args);
  TRANSFORM_REGISTRY['test'] = wrappedTransformFunction;
  console.log('registered transform!');
}

export default transform;
