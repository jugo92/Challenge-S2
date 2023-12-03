const OrderStatus = require("../Enum/orderStatus");

const { DataTypes, Model } = require("sequelize");
const userMongo = require("../dtos/denormalization/userMongo");
const orderMongo = require("../dtos/denormalization/orderMongo");

module.exports = function (connection) {
  class Order extends Model {
    static associate(db) {
      Order.belongsTo(db.User);
      db.User.hasMany(Order);
    }
    static addHooks(db) {
      Order.addHook("afterCreate", async order => {
        userMongo(
          order.UserId,
          db.User,
          db.Order,
          db.ProductOrder,
          db.Product,
          db.Payment,
          db.Invoice
        );
        orderMongo(order.id, db.Order, db.User);
      });
      Order.addHook("afterUpdate", order => {
        userMongo(
          order.UserId,
          db.User,
          db.Order,
          db.ProductOrder,
          db.Product,
          db.Payment,
          db.Invoice
        );
        orderMongo(order.id, db.Order, db.User);
      });
    }
  }

  Order.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      TTC: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isPositive(value) {
            if (value < 0) {
              throw new Error("La valeur TTC doit être positive.");
            }
          },
        },
      },
      status: {
        type: DataTypes.ENUM(
          "Pending",
          "Validate",
          "Canceled",
          "Partiel_Refund",
          "Refund"
        ),
        defaultValue: "Pending",
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "L'adresse e-mail ne peut pas être vide.",
          },
          isEmail: {
            msg: "Veuillez fournir une adresse e-mail valide.",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "L'adresse ne peut pas être vide.",
          },
          len: {
            args: [2, 255], // Ajustez les valeurs minimales et maximales selon vos besoins
            msg: "L'adresse doit avoir entre 2 et 255 caractères.",
          },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "L'adresse ne peut pas être vide.",
          },
          len: {
            args: [2, 255], // Ajustez les valeurs minimales et maximales selon vos besoins
            msg: "La ville doit avoir entre 2 et 255 caractères.",
          },
        },
      },
      zip: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Le code postal ne peut pas être vide.",
          },
          is: {
            args: /^\d{5}$/, // Exemple pour un code postal à 5 chiffres, ajustez selon vos besoins
            msg: "Le code postal doit avoir le format correct.",
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Le numero de telephone ne peut pas être vide.",
          },
          is: {
            args: /^\d{10}$/,
            msg: "Le numero de telephone doit avoir le format correct.",
          },
        },
      },
      tracking_url:{
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize: connection,
      tableName: "Order",
    }
  );

  return Order;
};
