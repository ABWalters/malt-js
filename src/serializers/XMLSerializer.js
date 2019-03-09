var builder = require('xmlbuilder');

class XMLSerializer {
  static serializeResponse(response) {
    const xmlBuilder = builder
      .create('MaltegoMessage')
      .ele('MaltegoTransformResponseMessage')
      .ele('Entities');
    XMLSerializer.serializeEntities(xmlBuilder, response.entities);
    // .ele('repo', { type: 'git' }, 'git://github.com/oozcitak/xmlbuilder-js.git')

    return xmlBuilder.end({ pretty: true });
  }

  static serializeEntities(xmlBuilder, entities) {
    entities.forEach(entity => {
      const entityEl = xmlBuilder.ele('Entity', { Type: entity.type });
      entityEl.ele('Value', {}, entity.value);
      entityEl.ele('Weight', {}, entity.weight);
      // TODO: Serialize display info
      const propertiesEl = entityEl.ele('AdditionalFields');
      Object.keys(entity.properties).forEach(propKey => {
        const prop = entity.properties[propKey];
        const { value, display, isStrict } = prop;
        propertiesEl.ele(
          'AdditionalField',
          { Name: propKey, MatchingRule: isStrict ? 'strict' : undefined, DisplayName: display },
          value
        );
      });
    });
  }
}

module.exports = XMLSerializer;
