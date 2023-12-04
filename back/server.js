const express = require("express");
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config({ path: ".env" });
require("./src/Mongo/db");
const path = require('path');
const fs = require('fs');
const ValidationError = require("./src/errors/ValidationError");
const Security = require("./src/Routes/security");
const path = require('path');
const fs = require('fs');
const port = process.env.PORT;
const {
  User,
  Order,
  Marque,
  Product,
  Payment,
  Refund,
  Category,
  StockHistory
} = require("./src/Models");

app.use(cors());
const routePrefix = "/api";

const stripeRoutes = require("./src/Routes/stripeRoutes");
const GenericRouter = require("./src/Routes/genericRouter");
const GenericController = require("./src/Controllers/genericController");
const GenericService = require("./src/Services/genericService");
const MongoService = require("./src/Services/mongoService");
const users = require("./src/Mongo/User");
const marques = require("./src/Mongo/Marque");
const categories = require("./src/Mongo/Category");
const orders = require("./src/Mongo/Order");
const payments = require("./src/Mongo/Payment");
const refunds = require("./src/Mongo/Refund");
const products = require("./src/Mongo/Product");
const stocks = require("./src/Mongo/StockHistory");
const multerMiddleware = require('./src/Middlewares/upload')

app.use(cookieParser());
app.use(routePrefix + "/stripe", stripeRoutes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routePrefix, Security);

app.get('/getImage/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'uploads', imageName);

  // Vérifiez si le fichier image existe
  if (fs.existsSync(imagePath)) {
    // Renvoyer l'image au client avec le bon type MIME
    res.sendFile(imagePath);
  } else {
    res.status(404).send('Image non trouvée');
  }
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Le dossier où les fichiers seront enregistrés
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Nom du fichier
//   },
// });

// const upload = multer({ storage: storage });

// // Route pour traiter l'upload d'image
// app.post('/upload', upload.single('image'), (req, res) => {
//   console.log("reqFile", req.file);
//   res.send('Image uploadée avec succès !');
// });


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
  routePrefix + "/marques",multerMiddleware,
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
  routePrefix + "/products",multerMiddleware,
  new GenericRouter(
    new GenericController(serviceProductProxy)
  ).getRouter()
);

const genericStockHistoryService = new GenericService(StockHistory);
const serviceStockHistoryProxy = new Proxy(genericStockHistoryService, {
  get(target, prop, receiver) {
    if (prop in createMongoMethods(stocks)) {
      return createMongoMethods(stocks)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
});
app.use(
  routePrefix + "/stocks",multerMiddleware,
  new GenericRouter(
    new GenericController(serviceStockHistoryProxy)
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
