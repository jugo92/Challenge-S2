const ProductMongo = require("../../Mongo/Product");
const { Op } = require("sequelize");
module.exports = async (
  modelId,
  key,
  Product,
  Brand,
  Category,
  event = "update",
  Stock
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
        model: Brand,
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

  const productMongoInstances = await Promise.all(
    products.map(async product => {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const totalCountIncrement = await Stock.sum("quantity", {
        where: {
          ProductId: product.id,
          [Op.or]: [
            { movement: "increment" },
            {
              movement: "reservation",
              createdAt: {
                [Op.gt]: fifteenMinutesAgo,
              },
            },
          ],
        },
      });
      const totalCountDecrement = await Stock.sum("quantity", {
        where: {
          ProductId: product.id,
          [Op.or]: [
            { movement: "decrement" },
            {
              movement: "order",
            },
            {
              movement: "reservation",
              createdAt: {
                [Op.lt]: fifteenMinutesAgo,
              },
            },
          ],
        },
      });
      const total = totalCountIncrement - totalCountDecrement;

      console.log("ICI : ", total);

      const productMongoData = {
        _id: product.dataValues.id,
        name: product.dataValues.name,
        description: product.dataValues.description,
        price: product.dataValues.price,
        stock: total,
        quantity: product.dataValues.quantity,
        image: product.dataValues.image,
        state: product.dataValues.state,
        promotion: product.dataValues.promotion,
        isPublished: event === "destroy" ? 0 : product.dataValues.isPublished,
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
        Brand: product.dataValues.Brand?.dataValues,
        Category: product.dataValues.Category?.dataValues,
      };

      return new ProductMongo(productMongoData);
    })
  );

  const savePromises = productMongoInstances.map(productMongoInstance =>
    productMongoInstance.save()
  );
  await Promise.all(savePromises);
};
