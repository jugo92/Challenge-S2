const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://localhost:27019/challenge",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"));

module.exports = mongoose;
