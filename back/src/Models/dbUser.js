const { Model, DataTypes } = require("sequelize");
const { sendMail } = require("../Controllers/mailController");
const crypto = require("crypto");
module.exports = function (connection) {
  class User extends Model {
    static addHooks(db) {
      User.addHook(
        "afterCreate",
        async user => {
          console.log(user);
          await sendMail(user.dataValues, "validateUserAccount").then(
            response => {}
          );
        }
        //userMongo(user.id, db.User, db.Article)
      );
      // User.addHook("afterUpdate", user =>
      //   userMongo(user.id, {
      //     User: db.User,
      //     Article: db.Article,
      //     onlyRemove: true,
      //   })
      // );
    }
  }

  User.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      firstname: DataTypes.STRING(45),
      lastname: DataTypes.STRING(45),
      email: {
        type: DataTypes.STRING(120), // ou toute longueur adéquate
        unique: true,
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
      salt: {
        type: DataTypes.TEXT,
      },
      dateofbirth: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
