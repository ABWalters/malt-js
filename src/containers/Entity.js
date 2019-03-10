const { Display } = require('./Display');
const { getDisplayFromKey } = require('../utils');

class Entity {
  /**
   @param type {string} - Entity type
   @param value {string} - Entity value
   * */
  constructor(type, value) {
    this.type = type;
    this.value = value;
    this.weight = 100; // FIXME: More sensible default
    this.properties = {};
    this.display = new Display();
    this.addProperty = this.addProperty.bind(this);
  }

  addProperty(key, value, display = undefined, isStrict = false) {
    const finalDisplay = display || getDisplayFromKey(key);

    this.properties[key] = { value, display: finalDisplay, isStrict };
    const link = {}; // TODO: Implement Link
    return link;
  }
}

module.exports = Entity;
