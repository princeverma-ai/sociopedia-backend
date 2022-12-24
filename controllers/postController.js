//imports ----------------------------------------------------->
const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");

//Exports ---------------------------------------------------->
exports.getUserPost = async (req, res) => {
    try {
        const userPosts = await UserModel.findById(req.user.id).select("posts").populate({
            path: "posts",
        });
        res.status(200).json({
            status: "success",
            results: userPosts.length,
            data: {
                posts: userPosts.posts,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

//------------------------------------------------------------>
exports.createUserPost = async (req, res) => {
    try {
        //setting user id to the post
        req.body.user = req.user.id;

        const post = await PostModel.create(req.body);
        await UserModel.findByIdAndUpdate(
            req.user.id,
            {
                $push: { posts: post._id },
            },
            {
                new: true,
            }
        );

        res.status(201).json({
            status: "success",
            data: {
                post,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};
//------------------------------------------------------------>
exports.getPostById = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id).populate({
            path: "user",
            select: "name email photo",
        });
        res.status(200).json({
            status: "success",
            data: {
                post,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

//------------------------------------------------------------>
exports.updatePost = async (req, res) => {
    try {
        const post = await PostModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json({
            status: "success",
            data: {
                post,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

//------------------------------------------------------------>
exports.deletePost = async (req, res) => {
    try {
        await PostModel.findByIdAndDelete(req.params.id);
        await UserModel.findByIdAndUpdate(
            req.user.id,
            {
                $pull: { posts: req.params.id },
            },
            {
                new: true,
            }
        );

        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};
