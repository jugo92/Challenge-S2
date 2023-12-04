const { Model, DataTypes } = require("sequelize");
const productMongo = require("../dtos/denormalization/productMongo");
const { getNotificationUsersByType } = require("../Helper/Utils");
const { sendNotification } = require("../Controllers/mailController");

module.exports = function (connection) {
  class Product extends Model {
    static associate(db) {
      Product.belongsTo(db.Marque);
      Product.belongsTo(db.Category);
      db.Marque.hasMany(Product);
      db.Category.hasMany(Product);
    }
    static addHooks(db) {
      Product.addHook("afterCreate", product =>
        productMongo(product.id, "id", db.Product, db.Marque, db.Category)
      );
      Product.addHook("beforeUpdate", async product => {
        const productBeforeUpdate = await Product.findByPk(product.id);

        if (product.quantity < productBeforeUpdate.quantity_alert) {
          const admins = await db.User.findAll({
            where: {
              role: "admin",
            },
          });
          console.log("admin : ", admins);
          admins.forEach(async admin => {
            await sendNotification(
              "quantityAlert",
              "Quantité en alerte",
              admin,
              product,
              null,
              5
            );
          });
        }
        if (product.isPublished) {
          if (
            productBeforeUpdate.quantity < product.quantity &&
            product.isPublished
          ) {
            const notificationUsers = await getNotificationUsersByType(
              db.NotificationUser,
              db.User,
              db.Product,
              db.Category,
              1,
              product.id,
              null
            );
            notificationUsers.forEach(async notification => {
              await sendNotification(
                "restockProductNotification",
                "Produit restock",
                notification.User,
                notification.Product,
                notification.Category,
                1
              );
            });
          }
          if (product.price != productBeforeUpdate.price) {
            const notificationUsers = await getNotificationUsersByType(
              db.NotificationUser,
              db.User,
              db.Product,
              db.Category,
              2,
              product.id,
              null
            );
            notificationUsers.forEach(async notification => {
              await sendNotification(
                "variousPriceProductNotification",
                "Modification de prix",
                notification.User,
                notification.Product,
                notification.Category,
                2
              );
            });
          }
          if (
            product.CategoryId != productBeforeUpdate.CategoryId &&
            product.CategoryId != null
          ) {
            const notificationUsers = await getNotificationUsersByType(
              db.NotificationUser,
              db.User,
              db.Product,
              db.Category,
              3,
              null,
              product.CategoryId
            );
            notificationUsers.forEach(async notification => {
              await sendNotification(
                "newCategoryProductNotification",
                "Nouveau Produit",
                notification.User,
                notification.Product,
                notification.Category,
                3
              );
            });
          }
        }
      });
      Product.addHook("afterUpdate", product =>
        productMongo(product.id, "id", db.Product, db.Marque, db.Category)
      );
      Product.addHook("afterDestroy", product =>
        productMongo(product.id, "id", db.Product, db.Marque, db.Category)
      );
    }
  }

  Product.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [2, 255],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 1000],
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: {
            msg: "Le montant doit être un nombre flottant avec au plus deux chiffres après la virgule.",
            decimals: 2,
          },
          min: {
            args: [0],
            msg: "Le prix ne peut pas être négatif.",
          },
          max: {
            args: [1000000],
            msg: "Le prix ne peut pas dépasser 1 000 000.",
          },
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "La quantité doit être un nombre entier.",
          },
          min: {
            args: [0],
            msg: "La quantité ne peut pas être négative.",
          },
          max: {
            args: [1000],
            msg: "La quantité ne peut pas dépasser 1000.",
          },
        },
      },
      quantity_alert: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "La quantité d'alerte doit être un nombre entier.",
          },
          min: {
            args: [1],
            msg: "La quantité ne peut pas être négative.",
          },
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.ENUM(
          "Neuf",
          "Reconditionne",
          "Occasion",
          "Seconde Main"
        ),
        defaultValue: "NEUF",
        allowNull: false,
      },
      promotion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "La quantité doit être un nombre entier.",
          },
          min: {
            args: [0],
            msg: "La quantité ne peut pas être négative.",
          },
          max: {
            args: [90],
            msg: "La quantité ne peut pas dépasser 1000.",
          },
        },
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      tva: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "La quantité doit être un nombre entier.",
          },
          min: {
            args: [0],
            msg: "La tva ne peut pas être négative.",
          },
          max: {
            args: [50],
            msg: "La tva ne peut pas dépasser 50.",
          },
        },
      },
      resolution: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      storage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      loudspeaker: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      frontcamera: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      backcamera: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      weight: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      width: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      height: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      battery: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accesories: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      operatingSystem: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cpu: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gpu: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      tableName: "Product",
    }
  );

  return Product;
};
