// Verifie que les attributs envoyés dans la requête correspondent exactement à ceux de la table
module.exports.verifyRequestAttributes = (table, req) => {
  var keysFromTable;
  if (table.sequelize) {
    keysFromTable = Object.keys(table.rawAttributes).filter(
      key => key !== "id" && key !== "createdAt" && key !== "updatedAt"
    );
  } else {
    keysFromTable = Object.keys(table.schema.obj).filter(
      key => key !== "_id" && key !== "__v"
    );
  }
  const keysFromBody = Object.keys(req.body);
  return keysFromBody.every(key => keysFromTable.includes(key));
};

// Prototypes
Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  },
  enumerable: false,
});
