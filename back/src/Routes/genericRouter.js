// genericRouter.js

const express = require("express");

class GenericRouter {
  constructor(controller) {
    this.controller = controller;
    this.router = express.Router();

    this.router.get("/", this.controller.getAll.bind(this.controller));
    this.router.get("/:id", this.controller.getById.bind(this.controller));
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.put("/:id", this.controller.update.bind(this.controller));
    this.router.delete("/:id", this.controller.delete.bind(this.controller));
  }

  getRouter() {
    return this.router;
  }
}

module.exports = GenericRouter;
