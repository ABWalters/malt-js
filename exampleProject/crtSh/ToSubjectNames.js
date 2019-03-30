const { DNS } = require('../../src/entities');
const { CrtShID } = require('../entities');
const { getCrtShMatch } = require('./common');
const app = require('../../src/app');
const { toDetailsDesc } = require('./common');

const snRegex = /Subject.*?commonName.*?=.*?(.*?)<BR>/i;

async function idToSN(request, response) {
  const id = request.entity.value;

  const matchStr = await getCrtShMatch(id, snRegex);
  if (matchStr) {
    response.addChildEntity(DNS(matchStr));
  }
}

app.transform(
  {
    inputType: CrtShID,
    outputType: DNS,
    nameSuffix: 'SN',
    description: toDetailsDesc('subject name'),
    display: 'To Subject Name'
  },
  idToSN
);

const snaRegex = /Subject&nbsp;Alternative&nbsp;Name:(.*?)CT <A/i;

async function idToSAN(request, response) {
  const id = request.entity.value;

  const matchStr = await getCrtShMatch(id, snaRegex);
  if (matchStr) {
    const cleanedMatchStr = matchStr.replace(/DNS:/gi, '');
    const SANs = cleanedMatchStr
      .split('<BR>')
      .map(a => a.trim())
      .filter(a => a.length > 0);
    response.addChildEntity(DNS(matchStr));
  }
}

app.transform(
  {
    inputType: CrtShID,
    outputType: DNS,
    nameSuffix: 'SAN',
    description: toDetailsDesc('subject alternative names'),
    display: 'To Subject Alternative Names'
  },
  idToSAN
);
