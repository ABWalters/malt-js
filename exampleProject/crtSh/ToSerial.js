const { Phrase } = require('../../src/entities');
const { CrtShID } = require('../entities');
const { getCrtShMatch } = require('./common');
const app = require('../../src/app');
const { toDetailsDesc } = require('./common');

const serialRegex = /Serial&nbsp;Number:<\/A>(<BR>)(.*?[0-9]{1}.*?)<BR>/i;

async function idToSerial(request, response) {
  const id = request.entity.value;

  const matchStr = await getCrtShMatch(id, serialRegex, 2);
  if (matchStr) {
    response.addChildEntity(Phrase(matchStr));
  }
}

app.transform(
  {
    inputType: CrtShID,
    outputType: Phrase,
    nameSuffix: 'Serial',
    description: toDetailsDesc('serial'),
    display: 'To Serial'
  },
  idToSerial
);
