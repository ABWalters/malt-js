const { createEntityType } = require('../src/entities');

module.exports = {
  Identity: createEntityType('maltjs.Identity'),
  CrtShID: createEntityType('maltjs.CrtShID')
};
