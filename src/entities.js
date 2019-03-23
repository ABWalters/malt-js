const Entity = require('./containers/Entity');

function createEntityType(typeStr) {
  return (value, properties) => {
    return new Entity(typeStr, value, properties);
  };
}

module.exports = {
  createEntityType,
  DNS: createEntityType('maltego.DNS'),
  Hash: createEntityType('maltego.Hash'),
  Phrase: createEntityType('maltego.Phrase')
};
