//imports ----------------------------------------------------->
const express = require("express");
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");
const singleImageMiddleware = require("../utils/uploadMulter");

//Router ------------------------------------------------------>
const Router = express.Router();

Router.route("/")
    .get(authController.protect, postController.getUserPost)
    .post(authController.protect, singleImageMiddleware, postController.createUserPost);

Router.route("/:id")
    .get(authController.protect, postController.getPostById)
    .patch(authController.protect, singleImageMiddleware, postController.updatePost)
    .delete(authController.protect, postController.deletePost);

Router.route("/:id/like").patch(authController.protect, postController.likePost);
Router.route("/:id/comment").post(authController.protect, postController.commentPost);

//Export Router ----------------------------------------------->
module.exports = Router;
