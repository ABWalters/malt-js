import Entity from '../containers/Entity';
import Request from '../containers/Request';

class LocalSerializer {
  /*
    Serializer used when running local transforms.
   */

  static serialize(maltegoArgs) {
    const request = new Request();
    const [value, ...properties] = maltegoArgs;
    const inputEntity = new Entity('maltego.Local', value);
    LocalSerializer.addPropertiesToEntity(properties, inputEntity);

    request.addEntity(inputEntity);
    return request;
  }

  static addPropertiesToEntity(properties, entity) {
    properties.forEach(prop => {
      const [key, val] = prop.split('=', 2);
      entity.addProperty(key, val);
    });
  }
}

export default LocalSerializer;
