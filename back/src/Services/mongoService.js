class MongoService {
  constructor(model) {
    this.Model = model;
  }

  async getAll(query) {
    console.log(query);
    return this.Model.find();
  }
}

module.exports = MongoService;
