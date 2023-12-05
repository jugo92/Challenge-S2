class MongoService {
  constructor(model) {
    this.Model = model;
  }

  async getAll(req, res) {
    const { page: reqPage, limit: reqLimit, ...filters } = req.query;
    const page = parseInt(reqPage) || 1;
    const limit = parseInt(reqLimit) || 10;
    const query = this.Model.find(filters)
      .skip((page - 1) * limit)
      .limit(limit);
    const models = await query.exec();
    const countQuery = this.Model.countDocuments(filters);

    const countTotal = await countQuery.exec();
    return res.status(200).json({ models, countTotal });
  }

  async getById(req, res) {
    try {
      const model = await this.Model.findById(req.params.id);
      if (!model) {
        return res.status(404);
      }
      res.status(200).json(model);
    } catch (error) {
      console.error("Erreur lors de la récupération", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
}

module.exports = MongoService;
