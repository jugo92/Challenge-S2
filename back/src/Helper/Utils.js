const fs = require("fs");
const { Order, Product, ProductOrder, User, Tva } = require("../Models/");

function isPasswordExpired(passwordChangeDate, maxAgeInDays) {
  const currentDate = new Date();
  const expirationDate = new Date(passwordChangeDate);
  expirationDate.setDate(expirationDate.getDate() + maxAgeInDays);
  return currentDate > expirationDate;
}

const base64_encode = imgPath => {
  let png = fs.readFileSync(imgPath);

  return new Buffer.from(png).toString("base64");
};

const generateDataFacture = async OrderId => {
  const orderData = await Order.findByPk(OrderId, {
    include: [
      {
        model: User,
      },
      {
        model: ProductOrder,
        include: [
          {
            model: Product,
            include: [{ model: Tva }],
          },
        ],
      },
    ],
  });
  return {
    client: {
      address: orderData.dataValues.User.dataValues.adress,
      zip: orderData.dataValues.User.dataValues.zip,
      city: orderData.dataValues.User.dataValues.city,
      country: orderData.dataValues.User.dataValues.country,
    },
    information: {
      number: orderData.dataValues.id,
      date: new Date().toString(),
    },
    products: orderData.dataValues.ProductOrders.map(productOrder => {
      return {
        quantity: productOrder.dataValues.quantity,
        description: productOrder.dataValues.Product.dataValues.name,
        price: productOrder.dataValues.Product.dataValues.price,
        "tax-rate":
          productOrder.dataValues.Product.dataValues.Tva.dataValues.rate,
      };
    }),
  };
};

module.exports = {
  isPasswordExpired,
  base64_encode,
  generateDataFacture,
};
