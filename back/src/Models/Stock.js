const { DataTypes, Model } = require("sequelize");
const { sendNotification, sendMail } = require("../Controllers/mailController");
const { Op } = require("sequelize");
const fs = require("fs").promises
module.exports = function (connection) {
  class Stock extends Model {
    static associate(db) {
      Stock.belongsTo(db.Product);
      db.Product.hasMany(Stock);
    }
    static addHooks(db) {
      Stock.addHook("afterCreate", async stock => {
        const product = await db.Product.findByPk(stock.ProductId);
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

        const totalCountIncrement = await Stock.sum('quantity', {
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
        const totalCountDecrement = await Stock.sum('quantity', {
          where: {
            ProductId: product.id,
            [Op.or]: [
              { movement: "decrement" },
              {
                movement: "order"
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
        const total = totalCountIncrement - totalCountDecrement
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
