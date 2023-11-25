const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://root:challenges2@atlascluster.w2ouj6n.mongodb.net/challenge-s2?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDB connected"));

module.exports = mongoose;
