const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: ".env" });
const port = process.env.PORT;
// require("./src/db");
// const Marque = require("./src/Models/dbMarque");
const { User } = require("./src/Models");

// const mainRoutes = require("./src/Routes");
// require("./Statistique/dbStatistique");

app.use(cors());
const routePrefix = "/api";

// const stripeRoutes = require("./src/Routes/stripeRoutes");
const GenericRouter = require("./src/Routes/genericRouter");
const GenericController = require("./src/Controllers/genericController");
const GenericService = require("./src/Services/genericService");
const MongoService = require("./src/Services/mongoService");
const MarqueMongo = require("./src/Models/dbMarqueMongo");
// app.use(routePrefix + "/stripe", stripeRoutes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const genericService = new GenericService(Marque);

// const serviceProxy = new Proxy(genericService, {
//   get(target, prop, receiver) {
//     console.log(prop);
//     if (prop === "getAll") {
//       const ms = new MongoService(MarqueMongo);
//       return ms.getAll.bind(ms);
//     }
//     return Reflect.get(target, prop, receiver);
//   },
// });

// const genericController = new GenericController(serviceProxy);

// app.use(
//   routePrefix + "/marques",
//   new GenericRouter(genericController).getRouter()
// );

app.use(
  routePrefix + "/users",
  new GenericRouter(new GenericController(new GenericService(User))).getRouter()
);

// app.use(mainRoutes);

// app.get("/failed", async (req, res) => {
//   console.log("FAILED");
// });

// app.get("/success", async (req, res) => {
//   console.log("SUCCESS");
//   res.status(200).json({ message: "gg" });
// });

app.listen(port, () => {
  console.log(`Port d'écoute: ${port}`);
});
