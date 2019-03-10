function getDisplayFromKey(value) {
  return value.replace(/_/gi, ' ').replace(/(^|\s)\w/gi, x => x.toUpperCase());
}

module.exports = {
  getDisplayFromKey
};
