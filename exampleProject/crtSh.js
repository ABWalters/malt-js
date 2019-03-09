const axios = require('axios');
const Entity = require('../src/containers/Entity');
const app = require('../src/app');

const entityTypes = {
  identity: 'maltjs.Identity',
  crtShID: 'maltjs.CrtShID',
  phrase: 'maltego.Phrase'
};

function responseToEntities(response, apiResponse) {
  const data = apiResponse.data;
  return data.forEach(item => {
    const { min_cert_id, ...props } = item;
    const entity = new Entity(entityTypes.phrase, min_cert_id);
    Object.keys(props).forEach(key => {
      const value = props[key];
      entity.addProperty(key, value);
    });
    response.addChildEntity(entity);
  });
}

app.transform(
  { inputType: entityTypes.phrase, outputType: entityTypes.crtShID },
  async function identityToIDs(request, response) {
    const identity = request.entity.value;
    const url = `https://crt.sh/?Identity=${encodeURIComponent(identity)}&output=json`;
    try {
      const apiResponse = await axios(url);
      responseToEntities(response, apiResponse);
    } catch (error) {
      console.log(error);
      response.messages.error('Unable to contact crt.sh API.');
    }
  }
);
