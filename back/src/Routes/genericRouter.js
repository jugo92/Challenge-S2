const express = require("express");
const checkAuth = require("../Middlewares/checkAuth");
class GenericRouter {
  constructor(controller) {
    this.controller = controller;
    this.router = express.Router();

    this.router.get(
      "/",
      checkAuth(),
      this.controller.getAll.bind(this.controller)
    );
    this.router.get(
      "/:id",
      checkAuth(),
      this.controller.getById.bind(this.controller)
    );
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.put(
      "/:id",
      checkAuth(),
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      "/:id",
      checkAuth(),
      this.controller.delete.bind(this.controller)
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = GenericRouter;
