const { Model, DataTypes } = require("sequelize");
const { sendMail } = require("../Controllers/mailController");
const crypto = require("crypto");
const userMongo = require("../dtos/denormalization/userMongo");
module.exports = function (connection) {
  class User extends Model {
    static addHooks(db) {
      User.addHook("afterCreate", async user => {
        // await sendMail(user.dataValues, "validateUserAccount");
        userMongo(
          user.id,
          db.User,
          db.Order,
          db.ProductOrder,
          db.Product,
          db.Payment
        );
      });
      User.addHook("afterUpdate", user =>
        userMongo(
          user.id,
          db.User,
          db.Order,
          db.ProductOrder,
          db.Product,
          db.Payment
        )
      );
    }
  }

  User.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      firstname: DataTypes.STRING(45),
      lastname: DataTypes.STRING(45),
      email: {
        type: DataTypes.TEXT,
        validate: {
          max: 320,
          notNull: true,
        },
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        validate: {
          max: 320,
          notNull: true,
          //is: {
          //  args: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i,
          //  msg: "Password must be at least 8 characters long and contain at least one letter and one number",
          //},
        },
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
      },
      adress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
      },
      zip: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isAbove18(value) {
            const eighteenYearsAgo = new Date();
            eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
            if (value > eighteenYearsAgo) {
              throw new Error("L'utilisateur doit avoir plus de 18 ans.");
            }
          },
        },
      },
      role: {
        type: DataTypes.ENUM("admin", "user", "store_keeper"), // Ajoutez autant de rôles que nécessaire
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      loginAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lastPasswordChange: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      tableName: "User",
    }
  );

  User.addHook("beforeCreate", async function (user) {
    const bcrypt = require("bcryptjs");
    const hash = await bcrypt.hash(user.password, await bcrypt.genSalt(10));
    const token = crypto.randomBytes(30).toString("hex");
    user.password = hash;
    user.token = token;
  });

  User.addHook("beforeUpdate", async function (user, { fields }) {
    if (fields.includes("password")) {
      const bcrypt = require("bcryptjs");
      const hash = await bcrypt.hash(user.password, await bcrypt.genSalt(10));
      user.password = hash;
    }
  });

  return User;
};
