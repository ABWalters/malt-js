const { callAPI } = require('../../src/utils');
const { DNS } = require('../../src/entities');
const { CrtShID } = require('../entities');
const app = require('../../src/app');

async function getCrtShMatch(id, regex, groupIndex = 1) {
  const resp = await callAPI(`https://crt.sh/?id=${encodeURIComponent(id)}&output=json`);

  const match = regex.exec(resp.data);
  if (match) {
    return match[groupIndex]
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s*/, '');
  }
}

module.exports = {
  getCrtShMatch
};
