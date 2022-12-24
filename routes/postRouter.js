//imports ----------------------------------------------------->
const express = require("express");
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");

//Router ------------------------------------------------------>
const Router = express.Router();

Router.route("/")
    .get(authController.protect, postController.getUserPost)
    .post(authController.protect, postController.createUserPost);

Router.route("/:id")
    .get(authController.protect, postController.getPostById)
    .patch(authController.protect, postController.updatePost)
    .delete(authController.protect, postController.deletePost);

//Export Router ----------------------------------------------->
module.exports = Router;
