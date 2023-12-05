const { Model, DataTypes } = require("sequelize");
const { sendMail } = require("../Controllers/mailController");
const crypto = require("crypto");
const fs = require("fs").promises;
module.exports = function (connection) {
  class User extends Model {
    static addHooks(db) {
      User.addHook("afterCreate", async user => {
        const verifyRoute = "http://localhost:3000/api/verify/";
        let content = await fs.readFile(
          `mails/validateUserAccount.txt`,
          "utf8"
        );
        content = content
          .replace("{{name}}", user.lastname.toUpperCase())
          .replace("{{confirmLink}}", verifyRoute + user.token);
        await sendMail(user.email, "Vérifiez votre compte", null, content);
      });
      // User.addHook("afterUpdate", user => 
      // );
    }
  }

  User.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      firstname: {
        type: DataTypes.STRING(45),
        validate: {
          len: [2, 45],
        },
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING(45),
        validate: {
          len: [2, 45],
        },
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
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          isStrongPassword(value) {
            const strongPasswordRegex =
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

            if (!strongPasswordRegex.test(value)) {
              throw new Error(
                "Le mot de passe doit avoir au moins 12 caractères avec au moins une majuscule, un chiffre et un caractère spécial."
              );
            }
          },
        },
      },
      gender: {
        type: DataTypes.ENUM("H", "F"),
        allowNull: false,
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
        unique: true,
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
        type: DataTypes.ENUM("admin", "user", "store_keeper"),
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      isActive:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
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
