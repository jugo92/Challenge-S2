const { DataTypes, Model } = require("sequelize");
const { sendNotification, sendMail } = require("../Controllers/mailController");
const fs = require("fs").promises;
const productMongo = require("../dtos/denormalization/productMongo");
const { getTotalStock } = require("../Helper/Utils");
module.exports = function (connection) {
  class Stock extends Model {
    static associate(db) {
      Stock.belongsTo(db.Product);
      db.Product.hasMany(Stock);
    }
    static addHooks(db) {
      Stock.addHook("afterCreate", async stock => {
        const product = await db.Product.findByPk(stock.ProductId);
        productMongo(
          product.id,
          "id",
          db.Product,
          db.Brand,
          db.Category,
          "update",
          db.Stock
        )
        console.log('STOCK ------------- : ', stock)
        const total = await getTotalStock(product, db.Stock);
        console.log("TOTAL : ", total)
        if (total < product.quantity_alert) {
          const admins = await db.User.findAll({
            where: {
              role: "admin",
            },
          });
          let content = await fs.readFile(`mails/quantityAlert.txt`, "utf8");
          content = content.replace("{{product_name}}", product.name);
          admins.forEach(async admin => {
            let contentWithName = content.replace("{{name}}", admin.firstname);
            await sendMail(
              admin.email,
              "Quantité alerte",
              null,
              contentWithName
            );
          });
        }

        if (product.isPublished) {
          if (stock.movement === "increment" && product.isPublished) {
            let content = await fs.readFile(
              `mails/restockProductNotification.txt`,
              "utf8"
            );
            await sendNotification(
              content,
              "Restock de produit",
              product.id,
              null,
              1,
              db.User,
              db.NotificationUser
            );
          }
        }
      });
    }
  }

  Stock.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      movement: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "La quantité doit être un nombre entier.",
          },
          min: {
            args: [1],
            msg: "La quantité ne peut pas être négative.",
          },
        },
      },
    },
    {
      sequelize: connection,
      tableName: "Stock",
    }
  );

  return Stock;
};
