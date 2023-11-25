class MongoService {
  constructor(model) {
    this.Model = model;
  }

  async getAll(req, res) {
    // console.log("QUERY : ", query);
    console.log("MODEL : ", req.query);
    const models = await this.Model.find(req.query);
    return res.status(200).json(models);
  }
}

module.exports = MongoService;
