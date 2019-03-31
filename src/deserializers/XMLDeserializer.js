const Entity = require('../containers/Entity');
const Request = require('../containers/Request');
// const types = require('../types');
var parseString = require('xml2js').parseString;

class XMLDeserializer {
  /*
    Serializer used when running remote transforms.
   */

  static serialize(requestBody) {
    const maltegoRequest = requestBody.MaltegoMessage.MaltegoTransformRequestMessage;
    const entity = maltegoRequest[0].Entities[0];
    const limits = maltegoRequest[0].Limits;
    const type = entity.Entity[0]['$'].Type;
    const value = entity.Entity[0].Value[0];
    const slider = limits[0]['$'].HardLimit;
    console.log(JSON.stringify(entity, null, 2));
    console.log(type);
    console.log(value);
    console.log(slider);
    // parseString(requestBody, (err, result) => {
    //   console.log('Err:', err);
    //   console.log(result);
    //   const xmlRequest = result.MaltegoMessage.MaltegoTransformRequestMessage;
    //   console.log('xmlRequest');
    //   console.log(xmlRequest);
    // });
    const request = new Request();
    // const [value, ...properties] = maltegoArgs;
    // const inputEntity = new Entity(types.local, value);
    // XMLDeserializer.addPropertiesToEntity(properties, inputEntity);
    //
    // request.addEntity(inputEntity);
    request.addEntity(new Entity(type, value));
    return request;
  }

  // static addPropertiesToEntity(properties, entity) {
  //   properties.forEach(prop => {
  //     const [key, val] = prop.split('=', 2);
  //     entity.addProperty(key, val);
  //   });
  // }
}

module.exports = XMLDeserializer;
