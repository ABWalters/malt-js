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
      this.serializeEntityDisplay(entityEl, entity.display);
      this.serializeEntityProperties(entityEl, entity.properties);
    });
  }

  static serializeEntityDisplay(entityEl, display) {
    const displayEl = entityEl.ele('DisplayInformation');
    display.sections.forEach(sect => {
      const { text, title } = sect;
      const labelEl = displayEl.ele('Label', { Name: title, Type: 'text/html' });
      labelEl.dat(text);
    });
  }

  static serializeEntityProperties(entityEl, properties) {
    const propertiesEl = entityEl.ele('AdditionalFields');
    Object.keys(properties).forEach(propKey => {
      const prop = properties[propKey];
      const { value, display, isStrict } = prop;
      propertiesEl.ele(
        'AdditionalField',
        { Name: propKey, MatchingRule: isStrict ? 'strict' : undefined, DisplayName: display },
        value
      );
    });
  }
}

module.exports = XMLSerializer;
