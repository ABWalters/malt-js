class Response{
  constructor(){
    this.entities = [];
    this.links = [];

    this.addChildEntity = this.addChildEntity.bind(this);
  }

  addChildEntity(entity){
    this.entities.push(entity);
  }

  createChildEntity(entityType, entityValue){

  }
}

module.exports = Response;
