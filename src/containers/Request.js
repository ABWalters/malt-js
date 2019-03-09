class Request {
  constructor() {
    this.entities = [];
    this.links = [];

    this.addEntity = this.addEntity.bind(this);
    this.entity = undefined;
  }

  addEntity(entity) {
    this.entities.push(entity);
    if (this.entity === undefined) {
      this.entity = entity; // Set default entity.
    }
  }
}

module.exports = Request;
