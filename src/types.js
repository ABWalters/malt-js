import Entity from './containers/Entity';

export function createEntityType(typeStr) {
  return (value, properties) => {
    return new Entity(typeStr, value, properties);
  };
}

export const types = {
  DNS: createEntityType('maltego.DNS'),
  Hash: createEntityType('maltego.Hash'),
  Phrase: createEntityType('maltego.Phrase')
};
