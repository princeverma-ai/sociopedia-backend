//imports ----------------------------------------------------->
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const friendController = require("../controllers/friendController");
const homeController = require("../controllers/homeController");
const singleImageMiddleware = require("../utils/uploadMulter");

const express = require("express");

//Router ------------------------------------------------------>
const Router = express.Router();

Router.route("/").get(authController.protect, userController.getUsers);

Router.route("/getMe").get(
    authController.protect,
    userController.getMe,
    userController.getUserById
);

Router.route("/friend")
    .get(authController.protect, friendController.getFriends)
    .post(authController.protect, friendController.addFriend)
    .patch(authController.protect, friendController.removeFriend);

Router.route("/home").get(authController.protect, homeController.feed);

Router.route("/notifications")
    .get(authController.protect, homeController.getNotifications)
    .patch(authController.protect, homeController.clearNotifications);

Router.route("/:id")
    .get(authController.protect, userController.getUserById)
    .patch(authController.protect, singleImageMiddleware, userController.updateUser)
    .delete(authController.protect, userController.deleteUser);

//Export Router ----------------------------------------------->
module.exports = Router;
