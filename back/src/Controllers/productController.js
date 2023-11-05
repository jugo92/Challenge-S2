const Product = require("../Models/dbProduct");
const Modele = require("../Models/dbModel");
const Marque = require("../Models/dbMarque");
const mongoose = require("mongoose");
module.exports.createProductAndVersion = async (req, res) => {
  try {
    //creation du nouveau produit
    const product = await Product.create(req.body);

    const modelData = await getModeleData(req.body.idModel);

    await mongoose.models.products.create({
      id: product.dataValues.id.toString(),
      ...req.body,
      modele: modelData,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Erreur lors de la récupération des produits :", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des produits" });
  }
};
module.exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (err) {
    console.error("Erreur lors de la récupération des produits :", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des produits" });
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du produit" });
  }
};

module.exports.createProduct = async (req, res) => {
  try {
    const {
      nom,
      description,
      prix,
      dateLivraison,
      quantite,
      image,
      marque,
      modele,
      etat,
      promotion,
      numeroVersion,
      idTVA,
    } = req.body;

    console.log(idTVA);
    const newProduct = await Product.create({
      nom,
      description,
      prix,
      dateLivraison,
      quantite,
      image,
      marque,
      modele,
      etat,
      promotion,
      numeroVersion,
      idTVA,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du produit" });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    await product.destroy();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du produit" });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    const updatedData = req.body;

    await product.update(updatedData);

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du produit" });
  }
};

const getModeleData = async idModel => {
  try {
    const model = await Modele.findOne({ where: { id: idModel } });
    const marque = await Marque.findOne({ where: { id: model.idMarque } });

    return {
      id: model.id,
      name: model.name,
      description: model.description,
      marque: {
        id: marque.id,
        name: marque.name,
        description: marque.description,
      },
    };
  } catch (err) {
    console.error(err);
    return {};
  }
};
// const mongoModel = await mongoose.models[modelName]
//     .findOne({
//       id: modelId,
//     })
//     .sort({ version: -1 })
//     .exec();
//   console.log(mongoModel);
//   const { _id, ...modeleExistant } = mongoModel._doc;
//   await mongoose.models[modelName].create({
//     ...modeleExistant,
//     ...req.body,
//     version: mongoModel.version + 1,
//   });

//   await entityToUpdate.update({
//     ...req.body,
//     numeroVersion: parseInt(entityToUpdate.numeroVersion) + 1,
//   });
//   res.status(200).json(entityToUpdate);
