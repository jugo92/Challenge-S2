const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: ".env" });
require("./db");

const port = process.env.PORT;

app.get("/", (req, res) => {
  console.log("test");
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Port d'écoute: ${port}`);
});
