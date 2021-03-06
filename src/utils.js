import axios from 'axios';

function APIError(message) {
  return { type: 'APIError', message };
}

export function getDisplayFromKey(value) {
  return value.replace(/_/gi, ' ').replace(/(^|\s)\w/gi, x => x.toUpperCase());
}

export async function callAPI(url, axiosConfig) {
  try {
    return await axios(url, axiosConfig);
  } catch (e) {
    console.log('Call API caught excpetion', e);
    throw APIError('Unknown API error.');
  }
}
