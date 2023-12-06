class MongoService {
  constructor(model) {
    this.Model = model;
  }

  async getAll(req, res) {
    const {
      page: reqPage,
      limit: reqLimit,
      name,
      description,
      minPrice,
      maxPrice,
      categories,
      marques,
      promotions
    } = req.query;
    const page = parseInt(reqPage) || 1;
    const limit = parseInt(reqLimit) || 10;
    let filterObject = {}
    filterObject = buildFilterObject(name, description, minPrice, maxPrice, categories,marques, promotions);
    console.log("FILTER OBJECT : ", filterObject)
    const query = this.Model.find(filterObject)
      .skip((page - 1) * limit)
      .limit(limit);
    const models = await query.exec();
    const countQuery = this.Model.countDocuments(filterObject);

    const countTotal = await countQuery.exec();
    res.set("X-Total-Count", countTotal);
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

const buildFilterObject = (name, description, minPrice, maxPrice, categories, marques, promotions) => {
  let filterObject = {};
  console.log("LES MARQUES : ", marques)
  console.log("LA PROMOTION  : ", promotions)
  if (name) {
    filterObject.name = new RegExp(name, "i");
  }
  if (description) {
    filterObject.description = new RegExp(description, "i");
  }
  let minPriceParsed = parseInt(minPrice);
  if (minPriceParsed) {
    filterObject.price = filterObject.price || {};
    filterObject.price.$gte = minPriceParsed;
  }
  let maxPriceParsed = parseInt(maxPrice);
  if (maxPriceParsed) {
    filterObject.price = filterObject.price || {};
    filterObject.price.$lte = maxPriceParsed;
  }

  if (categories) {
    const categoriesArray = categories.split(',').map(category => category.trim());
    filterObject['Category.name'] = { $in: categoriesArray };
  }

  if (marques) {
    const brandArray = marques.split(',').map(marque => marque.trim());
    filterObject['Brand.name'] = { $in: brandArray };
  }
  console.log("PROMOTIONS : ", promotions)

  if (promotions === "true") {
    filterObject.promotion = { $gt: 0 }; 
  }

  return filterObject;
};

module.exports = MongoService;
