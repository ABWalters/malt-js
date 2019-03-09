function getDisplayFromKey(value) {
  return value.replace(/_/gi, ' ').replace(/(^|\s)\w/gi, x => x.toUpperCase());
}

class Entity {
  /**
   @param type {string} - Entity type
   @param value {string} - Entity value
   @param properties {object} - Entity properties
   **/
  constructor(type, value) {
    this.type = type;
    this.value = value;
    this.weight = 100; // FIXME: More sensible default
    this.properties = {};

    this.addProperty = this.addProperty.bind(this);
  }

  addProperty(key, value, display = undefined, isStrict = false) {
    const finalDisplay = display ? display : getDisplayFromKey(key);

    this.properties[key] = { value, display: finalDisplay, isStrict };
    const link = {};
    return link;
  }
}

module.exports = Entity;
