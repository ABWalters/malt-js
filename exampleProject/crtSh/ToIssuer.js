const { Phrase } = require('../../src/entities');
const { CrtShID } = require('../entities');
const { getCrtShMatch } = require('./common');
const app = require('../../src/app');

const issuerRegex = /Issuer.*?commonName.*?=.*?(.*?)<BR>/i;

async function idToIssuer(request, response) {
  const id = request.entity.value;

  const matchStr = await getCrtShMatch(id, issuerRegex);
  if (matchStr) {
    response.addChildEntity(Phrase(matchStr));
  }
}

app.transform({ inputType: CrtShID, outputType: Phrase, nameSuffix: 'Issuer' }, idToIssuer);
