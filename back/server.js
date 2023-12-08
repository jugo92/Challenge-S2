const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const isAdmin = require("./src/Middlewares/isAdmin");
const cors = require("cors");
require("dotenv").config({ path: ".env" });
require("./src/Mongo/db");
const ValidationError = require("./src/errors/ValidationError");
const Security = require("./src/Routes/security");
const checkAuth = require("./src/Middlewares/checkAuth");
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
  Stock,
  Basket,
  ProductBasket,
  Notification,
  NotificationUser
} = require("./src/Models");

app.use(cors({
  credentials: true,
  origin: ['http://localhost:5173', 'your-production-domain'],
}));
const routePrefix = "/api";

const stripeRoutes = require("./src/Routes/stripeRoutes");
const GenericController = require("./src/Controllers/genericController");
const  GenericRouter = require("./src/Routes/genericRouter");
const GenericService = require("./src/Services/genericService");
const MongoService = require("./src/Services/mongoService");
const orders = require("./src/Mongo/Order");
const payments = require("./src/Mongo/Payment");
const products = require("./src/Mongo/Product");
const multerMiddleware = require("./src/Middlewares/upload");
const cron = require("node-cron");
const { initCron } = require("./src/Cron/index");
cron.schedule("0 0 * * *", async () => {
  initCron();
});

app.get('/api/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join("invoice", filename);
  res.download(filePath, (err) => {
    if (err) {
      res.status(404).send('Fichier non trouvé');
    }
  });
});

app.use(cookieParser(process.env.JWT_NAME));
app.use(routePrefix + "/stripe", stripeRoutes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routePrefix, Security);

app.get('/api/getImage/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'uploads', imageName);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.sendFile(path.join(__dirname, 'uploads', "default.jpg"));
  }
});

const createMongoMethods = collection => {
  const ms = new MongoService(collection);
  return {
    getAll: ms.getAll.bind(ms),
    getById: ms.getById.bind(ms),
  };
};

const userRoutes = [
  { method: 'GET', path: '/', handler: 'getAll', middlewares: [checkAuth(),isAdmin] },
  { method: 'GET', path: '/:id', handler: 'getById', middlewares: [checkAuth(),isAdmin] },
  { method: 'POST', path: '/', handler: 'create', middlewares: [checkAuth(), isAdmin] },
  // { method: 'PUT', path: '/:id', handler: 'update', middlewares: [isAdmin()] },
  { method: 'PATCH', path: '/:id', handler: 'patch', middlewares: [checkAuth(), isAdmin] },
  // { method: 'DELETE', path: '/:id', handler: 'delete', middlewares: [] },
];  
const genericUserRouter = new GenericRouter(new GenericController(new GenericService(User)));
  userRoutes.forEach(route => {
    genericUserRouter.addRoute(route, route.middlewares);
});
app.use(
  routePrefix + "/users",
  genericUserRouter.getRouter()
); 

const brandRoutes = [
  { method: 'GET', path: '/', handler: 'getAll', middlewares: [] },
  { method: 'GET', path: '/:id', handler: 'getById', middlewares: [] },
  { method: 'POST', path: '/', handler: 'create', middlewares: [checkAuth(), isAdmin] },
  { method: 'PUT', path: '/:id', handler: 'update', middlewares: [checkAuth(), isAdmin] },
  { method: 'PATCH', path: '/:id', handler: 'patch', middlewares: [checkAuth(), isAdmin] },
  { method: 'DELETE', path: '/:id', handler: 'delete', middlewares: [checkAuth(), isAdmin] },
];  
const genericBrandRouter = new GenericRouter(new GenericController(new GenericService(Brand)));
  brandRoutes.forEach(route => {
    genericBrandRouter.addRoute(route, route.middlewares);
});
app.use(
  routePrefix + "/brands",
  genericBrandRouter.getRouter()
); 

const notificationRoutes = [
  { method: 'GET', path: '/', handler: 'getAll', middlewares: [checkAuth()] },
  { method: 'GET', path: '/:id', handler: 'getById', middlewares: [checkAuth()] },
  { method: 'POST', path: '/', handler: 'create', middlewares: [checkAuth()] },
  { method: 'PUT', path: '/:id', handler: 'update', middlewares: [checkAuth()] },
  { method: 'PATCH', path: '/:id', handler: 'patch', middlewares: [checkAuth()] },
  { method: 'DELETE', path: '/:id', handler: 'delete', middlewares: [checkAuth()] },
];  
const genericNotificationRouter = new GenericRouter(new GenericController(new GenericService(Notification)));
notificationRoutes.forEach(route => {
  genericNotificationRouter.addRoute(route, route.middlewares);
});
app.use(
  routePrefix + "/notifications",
  genericNotificationRouter.getRouter()
); 


const notificationUserRoutes = [
  { method: 'GET', path: '/', handler: 'getAll', middlewares: [] },
  { method: 'GET', path: '/:id', handler: 'getById', middlewares: [] },
  { method: 'POST', path: '/', handler: 'create', middlewares: [] },
  { method: 'PUT', path: '/:id', handler: 'update', middlewares: [] },
  { method: 'PATCH', path: '/:id', handler: 'patch', middlewares: [] },
  { method: 'DELETE', path: '/:id', handler: 'delete', middlewares: [] },
];  
const genericNotificationUserRouter = new GenericRouter(new GenericController(new GenericService(NotificationUser)));
notificationUserRoutes.forEach(route => {
  genericNotificationUserRouter.addRoute(route, route.middlewares);
});
app.use(
  routePrefix + "/notificationsusers",
  genericNotificationUserRouter.getRouter()
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

const orderRoutes = [
  { method: 'GET', path: '/', handler: 'getAll', middlewares: [checkAuth()] },
  { method: 'GET', path: '/:id', handler: 'getById', middlewares: [checkAuth()] },
  { method: 'POST', path: '/', handler: 'create', middlewares: [checkAuth()] },
  { method: 'PUT', path: '/:id', handler: 'update', middlewares: [checkAuth()] },
  { method: 'PATCH', path: '/:id', handler: 'patch', middlewares: [checkAuth()] },
  { method: 'DELETE', path: '/:id', handler: 'delete', middlewares: [checkAuth()] },
];  
const genericOrderRouter = new GenericRouter(new GenericController(serviceOrderProxy));
orderRoutes.forEach(route => {
  genericOrderRouter.addRoute(route, route.middlewares);
});
app.use(
  routePrefix + "/orders",
  genericOrderRouter.getRouter()
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

const paymentRoutes = [
  { method: 'GET', path: '/', handler: 'getAll', middlewares: [checkAuth()] },
  { method: 'GET', path: '/:id', handler: 'getById', middlewares: [checkAuth()] },
  { method: 'POST', path: '/', handler: 'create', middlewares: [checkAuth()] },
  { method: 'PUT', path: '/:id', handler: 'update', middlewares: [checkAuth()] },
  { method: 'PATCH', path: '/:id', handler: 'patch', middlewares: [checkAuth()] },
  { method: 'DELETE', path: '/:id', handler: 'delete', middlewares: [checkAuth()] },
];
const genericPaymentRouter = new GenericRouter(new GenericController(servicePaymentProxy));
paymentRoutes.forEach(route => {
  genericPaymentRouter.addRoute(route, route.middlewares);
});
app.use(
  routePrefix + "/payments",
  genericPaymentRouter.getRouter()
); 

const categorieRoutes = [
  { method: 'GET', path: '/', handler: 'getAll', middlewares: [] },
  { method: 'GET', path: '/:id', handler: 'getById', middlewares: [] },
  { method: 'POST', path: '/', handler: 'create', middlewares: [checkAuth(),isAdmin] },
  { method: 'PUT', path: '/:id', handler: 'update', middlewares: [checkAuth(),isAdmin] },
  { method: 'PATCH', path: '/:id', handler: 'patch', middlewares: [checkAuth(),isAdmin] },
  { method: 'DELETE', path: '/:id', handler: 'delete', middlewares: [checkAuth(), isAdmin] },
];  
const genericCategoryRouter = new GenericRouter(new GenericController(new GenericService(Category)));
categorieRoutes.forEach(route => {
  genericCategoryRouter.addRoute(route, route.middlewares);
});
app.use(
  routePrefix + "/categories",
  genericCategoryRouter.getRouter()
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
const productRoute = [
  { method: 'GET', path: '/', handler: 'getAll', middlewares: [] },
  { method: 'GET', path: '/:id', handler: 'getById', middlewares: [] },
  { method: 'POST', path: '/', handler: 'create', middlewares: [checkAuth(), isAdmin, multerMiddleware] },
  { method: 'PUT', path: '/:id', handler: 'update', middlewares: [checkAuth(),isAdmin,multerMiddleware] },
  { method: 'PATCH', path: '/:id', handler: 'patch', middlewares: [checkAuth(),isAdmin,multerMiddleware] },
  { method: 'DELETE', path: '/:id', handler: 'delete', middlewares: [checkAuth(), isAdmin] },
];  
const genericProductRouter = new GenericRouter(new GenericController(serviceProductProxy));
productRoute.forEach(route => {
    genericProductRouter.addRoute(route, route.middlewares);
});
app.use(
  routePrefix + "/products",
  genericProductRouter.getRouter()
);

const stockRoutes = [
  { method: 'GET', path: '/', handler: 'getAll', middlewares: [checkAuth(), isAdmin] },
  { method: 'GET', path: '/:id', handler: 'getById', middlewares: [checkAuth(), isAdmin] },
  { method: 'POST', path: '/', handler: 'create', middlewares: [checkAuth(), isAdmin] },
  { method: 'PUT', path: '/:id', handler: 'update', middlewares: [checkAuth(), isAdmin] },
  { method: 'PATCH', path: '/:id', handler: 'patch', middlewares: [checkAuth(),isAdmin] },
  { method: 'DELETE', path: '/:id', handler: 'delete', middlewares: [checkAuth(), isAdmin] },
];  
const genericStockRouter = new GenericRouter(new GenericController(new GenericService(Stock)));
stockRoutes.forEach(route => {
  genericStockRouter.addRoute(route, route.middlewares);
});
app.use(
  routePrefix + "/stocks",
  genericStockRouter.getRouter()
); 

const basketRoutes = [
  { method: 'GET', path: '/', handler: 'getAll', middlewares: [] },
  { method: 'GET', path: '/:id', handler: 'getById', middlewares: [] },
  { method: 'POST', path: '/', handler: 'create', middlewares: [] },
  { method: 'PUT', path: '/:id', handler: 'update', middlewares: [] },
  { method: 'PATCH', path: '/:id', handler: 'patch', middlewares: [] },
  { method: 'DELETE', path: '/:id', handler: 'delete', middlewares: [] },
];  
const genericBasketRouter = new GenericRouter(new GenericController(new GenericService(Basket)));
basketRoutes.forEach(route => {
  genericBasketRouter.addRoute(route, route.middlewares);
});
app.use(
  routePrefix + "/baskets",
  genericBasketRouter.getRouter()
); 

const productBasketRoutes = [
  { method: 'GET', path: '/', handler: 'getAll', middlewares: [] },
  { method: 'GET', path: '/:id', handler: 'getById', middlewares: [] },
  { method: 'POST', path: '/', handler: 'create', middlewares: [] },
  { method: 'PUT', path: '/:id', handler: 'update', middlewares: [] },
  { method: 'PATCH', path: '/:id', handler: 'patch', middlewares: [] },
  { method: 'DELETE', path: '/:id', handler: 'delete', middlewares: [] },
];  
const genericProductBasketRouter = new GenericRouter(new GenericController(new GenericService(ProductBasket)));
productBasketRoutes.forEach(route => {
  genericProductBasketRouter.addRoute(route, route.middlewares);
});
app.use(
  routePrefix + "/productsbaskets",
  genericProductBasketRouter.getRouter()
); 

const refundRoutes = [
  { method: 'GET', path: '/', handler: 'getAll', middlewares: [checkAuth(), isAdmin] },
  { method: 'GET', path: '/:id', handler: 'getById', middlewares: [checkAuth(),isAdmin] },
  { method: 'POST', path: '/', handler: 'create', middlewares: [checkAuth()] },
  { method: 'PUT', path: '/:id', handler: 'update', middlewares: [checkAuth(), isAdmin] },
  { method: 'PATCH', path: '/:id', handler: 'patch', middlewares: [checkAuth(),isAdmin] },
];  
const genericRefundRouter = new GenericRouter(new GenericController(new GenericService(Refund)));
refundRoutes.forEach(route => {
  genericRefundRouter.addRoute(route, route.middlewares);
});
app.use(
  routePrefix + "/refunds",
  genericRefundRouter.getRouter()
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
