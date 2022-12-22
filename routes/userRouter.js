//imports ----------------------------------------------------->
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const express = require("express");

//Router ------------------------------------------------------>
const Router = express.Router();

Router.route("/").get(authController.protect, userController.getUsers);
Router.route("/getMe").get(
    authController.protect,
    userController.getMe,
    userController.getUserById
);
Router.route("/:id")
    .get(authController.protect, userController.getUserById)
    .patch(authController.protect, userController.updateUser)
    .delete(authController.protect, userController.deleteUser);

//Export Router ----------------------------------------------->
module.exports = Router;
