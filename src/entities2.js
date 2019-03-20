const { createEntityType } = require('./utils');

const defaultEntityTypes = ['maltego.Phrase', 'maltego.Hash'];

const entityTypes = {};

defaultEntityTypes.forEach(type => {
  entityTypes[type] = createEntityType(type);
});

module.exports = defaultEntityTypes;
