//imports ----------------------------------------------------->
const authController = require("../controllers/authController");
const express = require("express");

//Router ------------------------------------------------------>
const Router = express.Router();

Router.route("/signup").post(authController.signup);
Router.route("/login").post(authController.login);
Router.route("/logout").get(authController.logout);

//Export Router ----------------------------------------------->
module.exports = Router;
