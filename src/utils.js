const axios = require('axios');
const Entity = require('./containers/Entity');

function APIError(message) {
  return { type: 'APIError', message };
}

function getDisplayFromKey(value) {
  return value.replace(/_/gi, ' ').replace(/(^|\s)\w/gi, x => x.toUpperCase());
}

function createEntityType(typeStr) {
  return (value, properties) => {
    return new Entity(typeStr, value, properties);
  };
}

async function callAPI(url, axiosConfig) {
  try {
    return await axios(url, axiosConfig);
  } catch (e) {
    console.log('Call API caught excpetion', e);
    throw APIError('Unknown API error.');
  }
}

module.exports = {
  getDisplayFromKey,
  callAPI,
  createEntityType
};
