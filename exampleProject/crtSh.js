/* eslint-disable camelcase */
const { findAll } = require('./utils');
const { callAPI } = require('../src/utils');
const { Hash, Phrase } = require('../src/entities');
const { Hash: HashEnt } = require('../src/entities2');
const { CrtShID: CrtShIDEnt } = require('./entities2');
const { CrtShID, Identity } = require('./entities');
const app = require('../src/app');
const { DisplayTable } = require('../src/containers/Display');

function responseToEntities(response, apiResponse) {
  const { data } = apiResponse;
  return data.forEach(item => {
    const { min_cert_id, ...props } = item;
    const entity = CrtShIDEnt(min_cert_id, props);

    const displayTable = DisplayTable.fromObject(props);
    entity.display.add(displayTable.toString());

    response.addChildEntity(entity);
  });
}

async function phraseToCrtShID(request, response) {
  const identity = request.entity.value;
  const resp = await callAPI(
    `https://crt.sh/?Identity=${encodeURIComponent(identity)}&output=json`
  );
  responseToEntities(response, resp);
}

app.transform({ inputType: Phrase, outputType: CrtShID }, phraseToCrtShID);

const hashValRegexExp = /<A href="(.*?)">(.*?)<\/A>/i;

function getHashValueAndLink(hashContent) {
  // Get hash value and link for hyperlinked hashes
  const match = hashValRegexExp.exec(hashContent);
  if (match) {
    const [, hashValue, hashLink] = match;
    return [hashValue, hashLink];
  }
  return [hashContent, ''];
}

const hashRegexExp = /<TH.*>(.*?)\(Certificate\)<\/TH>[\n\r\s]*<TD.*?>(.*)<\/TD>/gi;

function getHashes(data) {
  // Get hashes from crt.sh response
  const hashMatches = findAll(hashRegexExp, data);
  hashMatches.map(match => {
    const [, hashType, hashContent] = match;
    const [hashValue, hashLink] = getHashValueAndLink(hashContent);
    return { hashValue, hashLink, hashType };
  });
}

async function idToHash(request, response) {
  const identity = request.entity.value;

  const resp = await callAPI(`https://crt.sh/?q=${encodeURIComponent(identity)}&output=json`);
  const hashes = getHashes(resp.data);

  hashes.forEach(({ hashValue, hashLink, hashType }) => {
    response.addChildEntity(HashEnt(hashValue, { type: hashType, link: hashLink }));
  });
}

app.transform({ inputType: CrtShID, outputType: Hash }, idToHash);
