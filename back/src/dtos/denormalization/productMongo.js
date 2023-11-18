const ProductMongo = require("../../Mongo/Product");
module.exports = async (
  modelId,
  key,
  Product,
  Caracteristique,
  Marque,
  Category,
  Tva
) => {
  console.log("key : ", key);
  console.log("modelid : ", modelId);
  const products = await Product.findAll({
    where: {
      [key]: modelId,
    },
    include: [
      {
        model: Caracteristique,
      },
      {
        model: Category,
      },
      {
        model: Marque,
      },
      {
        model: Tva,
      },
    ],
  });

  for (const product of products) {
    console.log("PRODUIT TROUVE ARRAY : ", product);
    const productId = product.dataValues.id;

    await ProductMongo.deleteOne({ _id: productId });
  }
  const productMongoInstances = products.map(product => {
    const productMongoData = {
      _id: product.dataValues.id,
      description: product.dataValues.description,
      price: product.dataValues.price,
      quantity: product.dataValues.quantity,
      state: product.dataValues.state,
      promotion: product.dataValues.promotion,
      Marque: product.dataValues.Marque.dataValues,
      Caracteristique: product.dataValues.Caracteristique,
      Tva: product.dataValues.Tva,
      Category: product.dataValues.Category,
    };

    return new ProductMongo(productMongoData);
  });

  const savePromises = productMongoInstances.map(productMongoInstance =>
    productMongoInstance.save()
  );
  await Promise.all(savePromises);
};
