const mongoose = require("mongoose");
require('dotenv').config();
mongoose
  .connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"));

module.exports = mongoose;
