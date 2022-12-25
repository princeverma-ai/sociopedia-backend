//imports ----------------------------------------------------->
const express = require("express");
const searchcontroller = require("../controllers/searchController");
const authController = require("../controllers/authController");

//Router ------------------------------------------------------>
const Router = express.Router();

Router.route("/").get(authController.protect, searchcontroller.search);

//Export Router ----------------------------------------------->
module.exports = Router;
