/* eslint-disable camelcase */
const { callAPI } = require('../../src/utils');
const { Phrase, Hash } = require('../../src/entities');
const { CrtShID } = require('../entities');
const app = require('../../src/app');
const { DisplayTable } = require('../../src/containers/Display');

function responseToEntities(response, apiResponse) {
  const { data } = apiResponse;
  return data.forEach(item => {
    const { min_cert_id, ...props } = item;
    const entity = CrtShID(min_cert_id, props);

    const displayTable = DisplayTable.fromObject(props);
    entity.display.add(displayTable.toString());

    response.addChildEntity(entity);
  });
}

async function phraseToCrtShID(request, response) {
  const identity = request.entity.value;
  const resp = await callAPI(`https://crt.sh/?q=${encodeURIComponent(identity)}&output=json`);
  responseToEntities(response, resp);
}

const toIDDesc = input => `Query crt.sh and return the CrtSH IDs matching the search ${input}.`;

app.transform(
  {
    inputType: Phrase,
    outputType: CrtShID,
    description: toIDDesc('phrase')
  },
  phraseToCrtShID
);

app.transform(
  {
    inputType: Hash,
    outputType: CrtShID,
    description: toIDDesc('hash')
  },
  phraseToCrtShID
);
