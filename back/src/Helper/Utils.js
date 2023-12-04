const fs = require("fs");
const { Order, Product, ProductOrder, User } = require("../Models/");

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
          productOrder.dataValues.Product.tva,
      };
    }),
  };
};

const getNotificationUsersByType = async(NotificationUser, User,Product,Category,type, productId=null, categoryId=null) => {
  console.log('LE PRODUCT ID : ', productId);
  console.log('Le category ID : ', categoryId)
  console.log('TYPE : ', type)
  const notificationUsersType = await NotificationUser.findAll({
    where:{
      type_id: type,
      ProductId: productId,
      CategoryId: categoryId
    },
    include: [
      {
        model: User,
      },
      {
        model: Product,
      },
      {
        model: Category
      }
    ],
  })
  console.log("NOTIF : ", notificationUsersType)
  return notificationUsersType
}

module.exports = {
  isPasswordExpired,
  base64_encode,
  generateDataFacture,
  getNotificationUsersByType
};
