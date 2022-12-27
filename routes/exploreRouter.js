//imports ----------------------------------------------------->
const express = require("express");
const exploreController = require("../controllers/exploreController");
const authController = require("../controllers/authController");

//Router ------------------------------------------------------>
const Router = express.Router();

Router.route("/").get(authController.protect, exploreController.explore);

//Export Router ----------------------------------------------->
module.exports = Router;
