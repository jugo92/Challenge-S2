const express = require("express");
const app = express();
const multer = require("multer");
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
  Payment,
  Refund,
  Category
} = require("./src/Models");

app.use(cors());
const routePrefix = "/api";

const stripeRoutes = require("./src/Routes/stripeRoutes");
const GenericRouter = require("./src/Routes/genericRouter");
const GenericController = require("./src/Controllers/genericController");
const GenericService = require("./src/Services/genericService");
const MongoService = require("./src/Services/mongoService");
const users = require("./src/Mongo/User");
const tvas = require("./src/Mongo/Tva");
const marques = require("./src/Mongo/Marque");
const caracteristiques = require("./src/Mongo/Caracteristique");
const categories = require("./src/Mongo/Category");
const orders = require("./src/Mongo/Order");
const payments = require("./src/Mongo/Payment");
const refunds = require("./src/Mongo/Refund");
const products = require("./src/Mongo/Product");

app.use(cookieParser());
app.use(routePrefix + "/stripe", stripeRoutes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routePrefix, Security);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Le dossier où les fichiers seront enregistrés
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nom du fichier
  },
});

const upload = multer({ storage: storage });

// Route pour traiter l'upload d'image
app.post('/upload', upload.single('image'), (req, res) => {
  console.log("reqFile", req.file);
  res.send('Image uploadée avec succès !');
});

const createMongoMethods = (collection) => {
  const ms = new MongoService(collection);

  return {
    getAll: ms.getAll.bind(ms),
    getById: ms.getById.bind(ms),
  };
};

const genericUserService = new GenericService(User);
const serviceUserProxy = new Proxy(genericUserService, {
  get(target, prop, receiver) {
    if (prop in createMongoMethods(users)) {
      return createMongoMethods(users)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
});
app.use(
  routePrefix + "/users",
  new GenericRouter(new GenericController(serviceUserProxy)).getRouter()
);

const genericTvaService = new GenericService(Tva);
const serviceTvaProxy = new Proxy(genericTvaService, {
  get(target, prop, receiver) {
    if (prop in createMongoMethods(tvas)) {
      return createMongoMethods(tvas)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
});
app.use(
  routePrefix + "/tvas",
  new GenericRouter(new GenericController(serviceTvaProxy)).getRouter()
);

const genericCaracteristiqueService = new GenericService(Caracteristique);
const serviceCaracteristiqueProxy = new Proxy(genericCaracteristiqueService, {
  get(target, prop, receiver) {
    if (prop in createMongoMethods(caracteristiques)) {
      return createMongoMethods(caracteristiques)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
});
app.use(
  routePrefix + "/caracteristiques",
  new GenericRouter(
    new GenericController(serviceCaracteristiqueProxy)
  ).getRouter()
);

const genericMarqueService = new GenericService(Marque);
const serviceMarqueProxy = new Proxy(genericMarqueService, {
  get(target, prop, receiver) {
    if (prop in createMongoMethods(marques)) {
      return createMongoMethods(marques)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
});
app.use(
  routePrefix + "/marques",
  new GenericRouter(
    new GenericController(serviceMarqueProxy)
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
  new GenericRouter(
    new GenericController(serviceOrderProxy)
  ).getRouter()
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
  new GenericRouter(
    new GenericController(servicePaymentProxy)
  ).getRouter()
);

const genericCategoryService = new GenericService(Category);
const serviceCategoryProxy = new Proxy(genericCategoryService, {
  get(target, prop, receiver) {
    if (prop in createMongoMethods(categories)) {
      return createMongoMethods(categories)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
});
app.use(
  routePrefix + "/categories",
  new GenericRouter(
    new GenericController(serviceCategoryProxy)
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
  new GenericRouter(
    new GenericController(serviceProductProxy)
  ).getRouter()
);

const genericRefundService = new GenericService(Refund);
const serviceRefundProxy = new Proxy(genericRefundService, {
  get(target, prop, receiver) {
    if (prop in createMongoMethods(refunds)) {
      return createMongoMethods(refunds)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
});
app.use(
  routePrefix + "/refunds",
  new GenericRouter(
    new GenericController(serviceRefundProxy)
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
