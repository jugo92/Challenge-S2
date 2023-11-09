const MarqueMongo = require("../../dbMarqueMongo");

module.exports = async function (marqueId, Marque) {
  const marque = await Marque.findByPk(marqueId);
  await MarqueMongo.deleteOne({ _id: marqueId });

  const marqueMongo = new MarqueMongo({
    _id: marqueId,
    ...marque.dataValues,
  });
  await marqueMongo.save();
};
