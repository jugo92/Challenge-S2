const fs = require("fs");
const { Order, Product, ProductOrder, User } = require("../Models/");
const {Op} = require("sequelize")

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

const generateDataFacture = async (Order, OrderId) => {
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
        "tax-rate": 20,
      };
    }),
  };
};

const getTotalStock = async (product,Stock) => {
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
        return total;
}

module.exports = {
  isPasswordExpired,
  base64_encode,
  generateDataFacture,
  getTotalStock
};
