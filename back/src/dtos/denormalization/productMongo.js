const { getTotalStock } = require("../../Helper/Utils");
const ProductMongo = require("../../Mongo/Product");
module.exports = async (
  modelId,
  key,
  Product,
  Brand,
  Category,
  event = "update",
  Stock
) => {
console.log("test mongo cate", modelId, key)
  const products = await Product.findAll({
    where: {
      [key]: modelId,
    },
    include: [
      {
        model: Category,
      },
      {
        model: Brand,
      },
    ],
  });

  if (key === "id") {
    await ProductMongo.deleteOne({ _id: modelId });
  } else {

    const deletePromises = products.map(async product => {
      const productId = product.id;
      return ProductMongo.deleteOne({ _id: productId });
    })

    await Promise.all(deletePromises);
  }

  const productMongoInstances = await Promise.all(
    products.map(async product => {
      const total = await getTotalStock(product, Stock);
      const productMongoData = {
        _id: product.dataValues.id,
        name: product.dataValues.name,
        description: product.dataValues.description,
        price: product.dataValues.price,
        stock: total,
        image: product.dataValues.image,
        state: product.dataValues.state,
        promotion: product.dataValues.promotion,
        isPublished: event === "destroy" ? 0 : product.dataValues.isPublished,
        resolution: product.dataValues.resolution,
        size: product.dataValues.size,
        storage: product.dataValues.storage,
        loudspeaker: product.dataValues.loudspeaker,
        frontcamera: product.dataValues.frontcamera,
        weight: product.dataValues.weight,
        width: product.dataValues.width,
        height: product.dataValues.height,
        battery: product.dataValues.battery,
        code: product.dataValues.code,
        accesories: product.dataValues.accesories,
        operatingSystem: product.dataValues.operatingSystem,
        cpu: product.dataValues.cpu,
        gpu: product.dataValues.gpu,
        Brand: product.dataValues?.Brand?.dataValues || null,
        Category: product.dataValues.Category?.dataValues || null,
      };

      return new ProductMongo(productMongoData);
    })
  );

  const savePromises = productMongoInstances.map(productMongoInstance =>
    productMongoInstance.save()
  );
  await Promise.all(savePromises);
};
