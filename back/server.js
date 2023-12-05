const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config({ path: ".env" });
require("./src/Mongo/db");
const ValidationError = require("./src/errors/ValidationError");
const Security = require("./src/Routes/security");
const path = require('path');
const fs = require('fs');
const port = process.env.PORT;
const {
  User,
  Order,
  Brand,
  Product,
  Payment,
  Refund,
  Category,
  StockHistory,
} = require("./src/Models");

app.use(cors());
const routePrefix = "/api";

const stripeRoutes = require("./src/Routes/stripeRoutes");
const GenericRouter = require("./src/Routes/genericRouter");
const GenericController = require("./src/Controllers/genericController");
const GenericService = require("./src/Services/genericService");
const MongoService = require("./src/Services/mongoService");
const orders = require("./src/Mongo/Order");
const payments = require("./src/Mongo/Payment");
const products = require("./src/Mongo/Product");
const multerMiddleware = require("./src/Middlewares/upload");
const cron = require("node-cron");
const { initCron } = require("./src/Cron/index");

// cron.schedule("*/5 * * * * *", async () => {
//   initCron();
// });

app.use(cookieParser());
app.use(routePrefix + "/stripe", stripeRoutes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routePrefix, Security);

const createMongoMethods = collection => {
  const ms = new MongoService(collection);

  return {
    getAll: ms.getAll.bind(ms),
    getById: ms.getById.bind(ms),
  };
};

app.use(
  routePrefix + "/users",
  new GenericRouter(new GenericController(new GenericService(User))).getRouter()
);

app.use(
  routePrefix + "/brands",
  multerMiddleware,
  new GenericRouter(
    new GenericController(new GenericService(Brand))
  ).getRouter()
);

const genericOrderService = new GenericService(Order);
const serviceOrderProxy = new Proxy(genericOrderService, {
  get(target, prop, receiver) {
    if (prop in createMongoMethods(orders)) {
      return createMongoMethods(orders)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
});
app.use(
  routePrefix + "/orders",
  new GenericRouter(new GenericController(serviceOrderProxy)).getRouter()
);

const genericPaymentService = new GenericService(Payment);
const servicePaymentProxy = new Proxy(genericPaymentService, {
  get(target, prop, receiver) {
    if (prop in createMongoMethods(payments)) {
      return createMongoMethods(payments)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
});
app.use(
  routePrefix + "/payments",
  new GenericRouter(new GenericController(servicePaymentProxy)).getRouter()
);

app.use(
  routePrefix + "/categories",
  new GenericRouter(
    new GenericController(new GenericService(Category))
  ).getRouter()
);

const genericProductService = new GenericService(Product);
const serviceProductProxy = new Proxy(genericProductService, {
  get(target, prop, receiver) {
    if (prop in createMongoMethods(products)) {
      return createMongoMethods(products)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
});
app.use(
  routePrefix + "/products",
  multerMiddleware,
  new GenericRouter(new GenericController(serviceProductProxy)).getRouter()
);

app.use(
  routePrefix + "/stocks",
  multerMiddleware,
  new GenericRouter(
    new GenericController(new GenericService(StockHistory))
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
