const { Display } = require('./Display');
const { getDisplayFromKey } = require('../utils');

class Entity {
  /**
   @param type {string} - Entity type
   @param value {string} - Entity value
   @param properties {object} - Initial properties in format { name: value }
   * */
  constructor(type, value, properties = {}) {
    this.type = type;
    this.value = value;
    this.weight = 100;
    this.properties = {};
    this.display = new Display();
    this.addProperty = this.addProperty.bind(this);

    Object.keys(properties).forEach(key => {
      this.addProperty(key, properties[key]);
    });
  }

  addProperty(key, value, display = undefined, isStrict = false) {
    const finalDisplay = display || getDisplayFromKey(key);

    this.properties[key] = { value, display: finalDisplay, isStrict };
  }
}

module.exports = Entity;
