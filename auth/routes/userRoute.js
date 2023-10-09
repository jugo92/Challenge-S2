const { Router } = require("express")
const userController = require("../controller/userController")

const router = Router()

router.post("/register", userController.registerUser)

router.post("/login", userController.loginUser)

router.get("/logout", userController.logoutUser)

router.get("/users", userController.getAllUsers)

router.delete("/user/:id", userController.deleteUser)

router.get("/user/:id", userController.getUserById)

router.post("/user", userController.createUser)

router.put("/user/:id", userController.updateUser)

router.get("/verify/:token", userController.verifyUser)

module.exports = router