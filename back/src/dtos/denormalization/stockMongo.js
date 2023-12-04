const StockHistoryMongo = require("../../Mongo/StockHistory");

module.exports = async function (stockId, StockHistory, Product) {
  const stock = await StockHistory.findByPk(stockId, {
    include: [
      {
        model: Product,
      },
    ],
  });
  const stockMongo = new StockHistoryMongo({
    _id: stockId,
    ...stock.dataValues,
    Product: stock.dataValues.Product.dataValues,
  });
  await stockMongo.save();
};
