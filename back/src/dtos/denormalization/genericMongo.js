module.exports = async function (id, modelDB, modelMongo) {
  const model = await modelDB.findByPk(id, {});
  await modelMongo.deleteOne({ _id: id });

  if (model) {
    const modelMongoData = new modelMongo({
      _id: id,
      ...model.dataValues,
    });
    await modelMongoData.save();
  }
};
