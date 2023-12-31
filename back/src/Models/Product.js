const { Model, DataTypes } = require("sequelize");
const productMongo = require("../dtos/denormalization/productMongo");
const fs = require("fs").promises;
const { sendNotification } = require("../Controllers/mailController");
module.exports = function (connection) {
  class Product extends Model {
    static associate(db) {
      Product.belongsTo(db.Brand);
      Product.belongsTo(db.Category);
      db.Brand.hasMany(Product);
      db.Category.hasMany(Product);
    }
    static addHooks(db) {
      Product.addHook("afterCreate", product =>
        productMongo(
          product.id,
          "id",
          db.Product,
          db.Brand,
          db.Category,
          "update",
          db.Stock
        )
      );
      Product.addHook("beforeUpdate", async product => {
        const productBeforeUpdate = await Product.findByPk(product.id);

        if (product.isPublished) {
          if (product.price != productBeforeUpdate.price) {
            let content = await fs.readFile(
              `mails/variousPriceProductNotification.txt`,
              "utf8"
            );
            content = content.replace("{{new_price}}", product.price);
            await sendNotification(
              content,
              "Nouveau prix !",
              product.id,
              null,
              2,
              db.User,
              db.NotificationUser
            );
          }
          if (
            product.CategoryId != productBeforeUpdate.CategoryId &&
            product.CategoryId != null
          ) {
            let content = await fs.readFile(
              `mails/newCategoryProductNotification.txt`,
              "utf8"
            );
            await sendNotification(
              content,
              "Nouveau Produit !",
              null,
              product.CategoryId,
              3,
              db.User,
              db.NotificationUser
            );
          }
        }
      });
      Product.addHook("afterUpdate", product =>
        productMongo(
          product.id,
          "id",
          db.Product,
          db.Brand,
          db.Category,
          "update",
          db.Stock
        )
      );
      Product.addHook("afterDestroy", product =>
        productMongo(
          product.id,
          "id",
          db.Product,
          db.Brand,
          db.Category,
          "update",
          db.Stock
        )
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
