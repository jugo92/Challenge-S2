const { DataTypes, Model } = require("sequelize");

module.exports = function (connection) {
  class NotificationUser extends Model {
    static associate(db) {
      NotificationUser.belongsTo(db.User);
      NotificationUser.belongsTo(db.Category);
      NotificationUser.belongsTo(db.Product);
      db.User.hasMany(NotificationUser);
    }
  }

  NotificationUser.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      type_id:{
        type: DataTypes.INTEGER
      }
    },
    {
      sequelize: connection,
      tableName: "NotificationUser",
    }
  );

  return NotificationUser;
};
