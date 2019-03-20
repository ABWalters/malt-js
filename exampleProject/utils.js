function findAll(regexExp, data) {
  // Find all matches for a given regex exp.
  const results = [];
  let regexMatch = regexExp.exec(data);
  while (regexMatch != null) {
    results.push(regexMatch);
    regexMatch = regexExp.exec(data);
  }
  return results;
}

module.exports = {
  findAll
};
