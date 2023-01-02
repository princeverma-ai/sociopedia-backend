//imports ----------------------------------------------------->
const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");
const imageHandler = require("../utils/imgHandler");
const commentController = require("./commentController");
const homeController = require("./homeController");
const onlineUserController = require("./onlineUserController");
const { notificationEmitter } = require("../utils/eventManagment");

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

        //if there is image in the request
        if (req.file) {
            const result = await imageHandler.addImage(req.file);
            if (!result.public_id) {
                return res.status(400).json({
                    status: "fail",
                    message: "error: image not uploaded",
                });
            }
            req.body.photo = { id: result._id, url: result.secure_url };
        }

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
        const post = await PostModel.findById(req.params.id)
            .populate({
                path: "user",
                select: "name email photo",
            })
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "name  photo",
                },
                select: "user text createdAt",
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
        //if there is image in the request
        if (req.file) {
            //finding the post
            const post = await PostModel.findById(req.params.id);

            //replacing old image with new image
            const result = await imageHandler.replaceImage(req.file, post.photo.id);
            if (!result.public_id) {
                return res.status(400).json({
                    status: "fail",
                    message: "error: image not uploaded",
                });
            }

            req.body.photo = { id: result._id, url: result.secure_url };
        }
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
        //finding the post
        const post = await PostModel.findById(req.params.id);

        //deleting the image
        await imageHandler.deleteImage(post.photo.id);

        //deleting the post
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

//------------------------------------------------------------>
exports.getLikedPosts = async (req, res) => {
    try {
        const userID = req.user.id;
        const posts = await PostModel.find({ likes: userID }).populate({
            path: "user",
            select: "name email photo",
        });

        res.status(200).json({
            status: "success",
            data: {
                posts,
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
const addLikeToPost = async (isLiked, postID, likerID) => {
    if (isLiked) {
        await PostModel.findByIdAndUpdate(
            postID,
            {
                $pull: { likes: likerID },
            },
            {
                new: true,
            }
        );
    } else {
        await PostModel.findByIdAndUpdate(
            postID,
            {
                $push: { likes: likerID },
            },
            {
                new: true,
            }
        );
    }
};

//------------------------------------------------------------>
exports.likePost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        const isLiked = post.likes.includes(req.user.id);

        //check if user is online
        const onlineUser = await onlineUserController.checkOnline(post.user);

        if (onlineUser && !isLiked) {
            addLikeToPost(isLiked, req.params.id, req.user.id);
            notificationEmitter.emit(`${onlineUser.socketID}`, {
                postId: req.params.id,
                like: true,
                comment: false,
                userWhoLiked: req.user.id,
                socketID: onlineUser.socketID,
            });
        } else {
            addLikeToPost(isLiked, req.params.id, req.user.id);
            !isLiked &&
                homeController.updateNotifications(
                    req.user.id,
                    req.params.id,
                    post.user,
                    true,
                    false
                );
        }

        res.status(200).json({
            status: "success",
            liked: !isLiked,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

//------------------------------------------------------------>
exports.commentPost = async (req, res) => {
    try {
        //create comment
        const comment = await commentController.createComment(req);

        //add comment to post
        const post = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: { comments: comment._id },
            },
            {
                new: true,
            }
        );

        //check if user is online
        const onlineUser = await onlineUserController.checkOnline(post.user);

        if (onlineUser) {
            console.log("comment emitted");

            notificationEmitter.emit(`${onlineUser.socketID}`, {
                postId: req.params.id,
                like: false,
                comment: req.body.text,
                userWhoCommented: req.user.id,
                socketID: onlineUser.socketID,
            });
        } else {
            homeController.updateNotifications(
                req.user.id,
                req.params.id,
                post.user,
                false,
                req.body.text
            );
        }

        res.status(201).json({
            status: "success",
            data: {
                comment,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};
