const router = require("express").Router();

const menuController = require("../controller/menuController");

router.get("/", menuController.getMenuItems);
router.get("/:id", menuController.getMenuItemById);
router.delete("/:id", menuController.deleteMenuItemById);
router.post("/", menuController.postMenuItem);
router.put("/:id", menuController.putMenuItemById);

module.exports = router;