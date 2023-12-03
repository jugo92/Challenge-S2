const ProductMongo = require("../../Mongo/Product");
module.exports = async (
  modelId,
  key,
  Product,
  Marque,
  Category,
  event = "update"
) => {
  const products = await Product.findAll({
    where: {
      [key]: modelId,
    },
    include: [
      {
        model: Category,
      },
      {
        model: Marque,
      },
    ],
  });

  if (key === "id") {
    //Dans le cas ou on supprime/modifie UN produit
    await ProductMongo.deleteOne({ _id: modelId });
  } else {
    if (event === "destroy") {
      await Product.update({ isPublished: 0 }, { where: { [key]: modelId } });
    }
    //Dans le cas ou on supprime/modifie marque/catagory
    for (const product of products) {
      const productId = product.dataValues.id;
      await ProductMongo.deleteOne({ _id: productId });
    }
  }

  const productMongoInstances = products.map(product => {
    const productMongoData = {
      _id: product.dataValues.id,
      name: product.dataValues.name,
      description: product.dataValues.description,
      price: product.dataValues.price,
      quantity: product.dataValues.quantity,
      image: product.dataValues.image,
      state: product.dataValues.state,
      promotion: product.dataValues.promotion,
      isPublished: event === "destroy" ? 0 : product.dataValues.isPublished,
      tva: product.dataValues.tva,
      resolution: product.dataValues.resolution,
      size: product.dataValues.size,
      storage: product.dataValues.storage,
      loudspeaker: product.dataValues.loudspeaker,
      frontcamera: product.dataValues.frontcamera,
      backcamera: product.dataValues.backcamera,
      weight: product.dataValues.weight,
      width: product.dataValues.width,
      height: product.dataValues.height,
      battery: product.dataValues.battery,
      code: product.dataValues.code,
      accesories: product.dataValues.accesories,
      operatingSystem: product.dataValues.operatingSystem,
      cpu: product.dataValues.cpu,
      gpu: product.dataValues.gpu,
      Marque: product.dataValues.Marque?.dataValues,
      Category: product.dataValues.Category?.dataValues,
    };

    return new ProductMongo(productMongoData);
  });

  const savePromises = productMongoInstances.map(productMongoInstance =>
    productMongoInstance.save()
  );
  await Promise.all(savePromises);
};
