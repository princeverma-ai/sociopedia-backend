//imports ----------------------------------------------------->
const UserModel = require("../models/userModel");
const PostModel = require("../models/postModel");
const APIFeatures = require("../utils/apiFeatures");

//Home Feed --------------------------------------------------->
exports.feed = async (req, res) => {
    try {
        //finding the user friends
        const user = await UserModel.findById(req.user.id).select("friends");

        //finding the posts of the user friends
        //query
        const features = new APIFeatures(
            PostModel.find({
                user: { $in: user.friends },
            })
                .populate("user", "name photo")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user",
                        select: "name photo",
                    },
                    select: "user text",
                }),
            req.query
        )
            .paginate()
            .sort();

        //execute query
        const posts = await features.query;

        //sending the posts
        res.status(200).json({
            status: "success",
            resultsInThisPage: posts.length,
            page: req.query.page,
            data: {
                posts,
            },
        });
    } catch (error) {
        console.log("error", error);
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

//get notifications------------------------------------------------>
exports.getNotifications = async (req, res) => {
    try {
        //finding the user
        const user = await UserModel.findById(req.user.id).select("notifications");

        //sending the notifications
        res.status(200).json({
            status: "success",
            data: {
                notifications: user.notifications,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

//update notifications-------------------------------------------->
exports.updateNotifications = async (
    currentUserID,
    postID,
    userID,
    like = false,
    comment = null
) => {
    try {
        //updating the notifications
        if (like) {
            await UserModel.findByIdAndUpdate(
                userID,
                {
                    $push: {
                        "notifications.newLikes": {
                            postid: postID,
                            likerID: currentUserID,
                        },
                    },
                },
                { new: true, runValidators: true }
            );
        }
        if (comment) {
            await UserModel.findByIdAndUpdate(
                userID,
                {
                    $push: {
                        "notifications.newComments": {
                            postid: postID,
                            comment: { commenterID: currentUserID, comment: comment },
                        },
                    },
                },
                { new: true, runValidators: true }
            );
        }
    } catch (error) {
        console.log(error);
    }
};

//delete notifications-------------------------------------------->
exports.clearNotifications = async (req, res) => {
    try {
        //deleting the notifications
        await UserModel.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    "notifications.newLikes": [],
                    "notifications.newComments": [],
                },
            },
            { new: true, runValidators: true }
        );

        //sending the response
        res.status(200).json({
            status: "success",
            message: "Notifications cleared successfully",
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};
