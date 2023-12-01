const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config({ path: ".env" });
require("./src/Mongo/db");
const ValidationError = require("./src/errors/ValidationError");
const Security = require("./src/Routes/security");
const port = process.env.PORT;
const {
  User,
  Tva,
  Caracteristique,
  Order,
  Marque,
  Product,
  Refund
} = require("./src/Models");

app.use(cors());
const routePrefix = "/api";

const stripeRoutes = require("./src/Routes/stripeRoutes");
const GenericRouter = require("./src/Routes/genericRouter");
const GenericController = require("./src/Controllers/genericController");
const GenericService = require("./src/Services/genericService");
const MongoService = require("./src/Services/mongoService");
const checkAuth = require("./src/Middlewares/checkAuth");
const users = require("./src/Mongo/User");
const { invoicePdf } = require("./src/Services/pdfService");
const { generateDataFacture } = require("./src/Helper/Utils");
// const MarqueMongo = require("./src/Models/dbMarqueMongo");

app.use(cookieParser());
app.use(routePrefix + "/stripe", stripeRoutes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routePrefix, Security);

const genericUserService = new GenericService(User);

const serviceUserProxy = new Proxy(genericUserService, {
  get(target, prop, receiver) {
    if (prop === "getAll") {
      const ms = new MongoService(users);
      return ms.getAll.bind(ms);
    }
    return Reflect.get(target, prop, receiver);
  },
});

app.use(
  routePrefix + "/users",
  new GenericRouter(new GenericController(serviceUserProxy)).getRouter()
);

app.get("/api/test", async (req, res) => {
  const data = await generateDataFacture(
    "018c0836-9757-7b17-93fd-ec07cfe14c70"
  );
  await invoicePdf(data);
  res.send("Hello");
});

app.use(
  routePrefix + "/tvas",
  new GenericRouter(new GenericController(new GenericService(Tva))).getRouter()
);

app.use(
  routePrefix + "/caracteristiques",
  new GenericRouter(
    new GenericController(new GenericService(Caracteristique))
  ).getRouter()
);

app.use(
  routePrefix + "/marques",
  new GenericRouter(
    new GenericController(new GenericService(Marque))
  ).getRouter()
);

app.use(
  routePrefix + "/orders",
  new GenericRouter(
    new GenericController(new GenericService(Order))
  ).getRouter()
);

app.use(
  routePrefix + "/products",
  new GenericRouter(
    new GenericController(new GenericService(Product))
  ).getRouter()
);

app.use(
  routePrefix + "/refunds",
  new GenericRouter(
    new GenericController(new GenericService(Refund))
  ).getRouter()
);

app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(422).json(err.errors);
  } else if (err instanceof SyntaxError) {
    res.sendStatus(400);
  } else {
    console.log(err);
    res.status(500).send(err.message);
  }
});

app.get("/failed", async (req, res) => {
  console.log("FAILED");
});

app.get("/success", async (req, res) => {
  console.log("SUCCESS");
  res.status(200).json({ message: "gg" });
});

app.listen(port, () => {
  console.log(`Port d'écoute: ${port}`);
});
