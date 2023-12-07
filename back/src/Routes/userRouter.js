const GenericRouter = require("./genericRouter");
const checkAuth = require("../Middlewares/checkAuth");
const passwordMiddleware = require("../Middlewares/passwordMiddleware");

class UserRouter extends GenericRouter {
  constructor(controller) {
    super(controller);
    const patchRouteIndex = this.router.stack.findIndex(layer => {
      return (
        layer.route && layer.route.path === "/:id" && layer.route.methods.patch
      );
    });

    if (patchRouteIndex !== -1) {
      this.router.stack.splice(patchRouteIndex, 1);
    }

    // Ajoutez la nouvelle route patch avec le middleware supplémentaire
    this.router.patch(
      "/:id",
      checkAuth(),
      passwordMiddleware,
      this.controller.patch.bind(this.controller)
    );
  }
}

module.exports = UserRouter;
