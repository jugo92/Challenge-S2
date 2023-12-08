const { DataTypes, Model } = require("sequelize");

module.exports = function (connection) {
  class Refund extends Model {
    static associate(db) {
      Refund.belongsTo(db.Order);
      Refund.belongsTo(db.User);
    }
    static addHooks(db) {
      Refund.addHook("afterCreate", refund => {
      });
      Refund.addHook("afterUpdate", refund => {
      });
      Refund.addHook("afterDestroy", refund => {
      });
    }
  }

  Refund.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      motif: {
        type: DataTypes.STRING,
      },
      amount_refund: {
        type: DataTypes.FLOAT,
        validate: {
          min: {
            args: [0], 
            msg: 'Le montant remboursé ne peut pas être négatif.',
          },
        },
      },
      response: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize: connection,
      tableName: "Refund",
    }
  );

  return Refund;
};
