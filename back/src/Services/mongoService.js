class MongoService {
  constructor(model) {
    this.Model = model;
  }

  async getAll(req, res) {
    const { page: reqPage, limit: reqLimit, productName, description, minPrice, maxPrice } = req.query;
    // console.log("LES FILTRES : ", filters)
    const page = parseInt(reqPage) || 1;
    const limit = parseInt(reqLimit) || 10;

      // Créez un objet pour stocker les filtres non vides
  const filterObject = {};

  // Ajoutez uniquement les filtres non vides à l'objet
  if (productName) {
    filterObject.name = new RegExp(productName, 'i');
  }

  if (description) {
    filterObject.description = new RegExp(description, 'i');
  }
  let min = parseInt(minPrice)
  if (Number.isInteger(min)) {
    console.log("ici : ", min)
    filterObject.price = filterObject.price || {};
    filterObject.price.$gte = min;
  }

  console.log(typeof maxPrice)
  if (Number.isInteger(maxPrice)) {
    console.log("LA : ", maxPrice)
    filterObject.price = filterObject.price || {};
    filterObject.price.$lte = maxPrice;
  }
  
  console.log(filterObject)

    const query = this.Model.find(filterObject)
      .skip((page - 1) * limit)
      .limit(limit);
    const models = await query.exec();
    const countQuery = this.Model.countDocuments(filterObject);

    const countTotal = await countQuery.exec();
    res.set('X-Total-Count', countTotal);
    return res.status(200).json(models);
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
