/* eslint-disable camelcase */
const { findAll } = require('../utils');
const { callAPI } = require('../../src/utils');
const { Hash } = require('../../src/entities');
const { CrtShID } = require('../entities');
const app = require('../../src/app');
const { DisplayLink } = require('../../src/containers/Display');

const hashValRegexExp = /<A href="(.*?)">(.*?)<\/A>/i;

function getHashValueAndLink(hashContent) {
  // Get hash value and link for hyperlinked hashes
  const match = hashValRegexExp.exec(hashContent);
  if (match) {
    const [, hashLink, hashValue] = match;
    return [hashLink, hashValue];
  }
  return ['', hashContent];
}

const hashRegexExp = /<TH.*>(.*?)\(Certificate\)<\/TH>[\n\r\s]*<TD.*?>(.*)<\/TD>/gi;

function getHashes(data) {
  // Get hashes from crt.sh response
  const hashMatches = findAll(hashRegexExp, data);
  return hashMatches.map(match => {
    const [, hashType, hashContent] = match;
    const [hashLink, hashValue] = getHashValueAndLink(hashContent);
    return { hashValue, hashLink, hashType };
  });
}

async function idToHash(request, response) {
  const identity = request.entity.value;
  const resp = await callAPI(`https://crt.sh/?id=${encodeURIComponent(identity)}&output=json`);

  const hashes = getHashes(resp.data);
  hashes.forEach(({ hashValue, hashLink, hashType }) => {
    const ent = response.addChildEntity(Hash(hashValue, { type: hashType, link: hashLink }));
    if (hashLink) {
      ent.display.add(DisplayLink(hashLink, 'View'));
    }
  });
}

app.transform({ inputType: CrtShID, outputType: Hash }, idToHash);
