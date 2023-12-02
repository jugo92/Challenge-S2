const { DataTypes, Model } = require("sequelize");
const refundMongo = require("../dtos/denormalization/refundMongo");

module.exports = function (connection) {
  class Refund extends Model {
    static associate(db) {
      Refund.belongsTo(db.Order);
      Refund.belongsTo(db.User);
    }
    static addHooks(db) {
      Refund.addHook("afterCreate", refund => {
        refundMongo(refund.id, db.Refund, db.User, db.Order);
      });
      Refund.addHook("afterUpdate", refund => {
        refundMongo(refund.id, db.Refund, db.User, db.Order);
      });
      Refund.addHook("afterDestroy", refund => {
        refundMongo(refund.id, db.Refund, db.User, db.Order);
      });
    }
  }

  Refund.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      accepted: {
        type: DataTypes.BOOLEAN,
      },
      motif: {
        type: DataTypes.STRING,
      },
      amount_refund: {
        type: DataTypes.INTEGER,
      },
      motif_accept_refund: {
        type: DataTypes.STRING,
      },
      motif_refused_refund: {
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
