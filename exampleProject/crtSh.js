/* eslint-disable camelcase */
const axios = require('axios');
const Entity = require('../src/containers/Entity');
const app = require('../src/app');
const { DisplayTable } = require('../src/containers/Display');

const entityTypes = {
  identity: 'maltjs.Identity',
  crtShID: 'maltjs.CrtShID',
  hash: 'maltego.Hash',
  phrase: 'maltego.Phrase'
};

function responseToEntities(response, apiResponse) {
  const { data } = apiResponse;
  return data.forEach(item => {
    const { min_cert_id, ...props } = item;
    const entity = new Entity(entityTypes.crtShID, min_cert_id);
    Object.keys(props).forEach(key => {
      const value = props[key];
      entity.addProperty(key, value);
    });

    const displayTable = DisplayTable.fromObject(props);
    entity.display.add(displayTable.toString());

    response.addChildEntity(entity);
  });
}

app.transform(
  { inputType: entityTypes.phrase, outputType: entityTypes.crtShID },
  async function phraseToIDs(request, response) {
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

const hashRegexExp = /<TH.*>(.*?)\(Certificate\)<\/TH>[\n\r\s]*<TD.*?>(.*)<\/TD>/gi;

const hashValRegexExp = /<A href="(.*?)">(.*?)<\/A>/i;
function parseHashValue(hashValue) {
  const match = hashValRegexExp.exec(hashValue);
  if (match) {
    const [entireMatch, hashRef, parsedHashValue] = match;
    return { hashRef, parsedHashValue };
  }
  return { parsedHashValue: hashValue };
}

function entityDetailsToHash(data, response) {
  let hashMatch = hashRegexExp.exec(data);
  while (hashMatch != null) {
    const [entireMatch, hashType, hashValue] = hashMatch;
    const { hashRef, parsedHashValue } = parseHashValue(hashValue);

    const entity = new Entity(entityTypes.hash, parsedHashValue);
    entity.addProperty('type', hashType);
    if (hashRef) {
      entity.addProperty('hashSource', hashRef);
    }
    response.addChildEntity(entity);

    hashMatch = hashRegexExp.exec(data);
  }
}

app.transform(
  { inputType: entityTypes.crtShID, outputType: entityTypes.hash },
  async function idToHash(request, response) {
    const identity = request.entity.value;
    const url = `https://crt.sh/?q=${encodeURIComponent(identity)}&output=json`;
    try {
      const apiResponse = await axios(url);
      entityDetailsToHash(apiResponse.data, response);
    } catch (error) {
      console.log(error);
      response.messages.error('Unable to contact crt.sh API.');
    }
  }
);
