//imports ----------------------------------------------------->
const UserModel = require("../models/userModel");

//Exports ---------------------------------------------------->
exports.getFriends = async (req, res) => {
    try {
        const data = await UserModel.findById(req.user.id).select("friends name").populate({
            path: "friends",
            select: "name email photo",
        });

        res.status(200).json({
            status: "success",
            data,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

//------------------------------------------------------------>
exports.addFriend = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndUpdate(
            req.user.id,
            {
                $push: { friends: req.body.friendId },
            },
            {
                new: true,
            }
        );
        res.status(200).json({
            status: "success",
            data: {
                user,
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
exports.removeFriend = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndUpdate(
            req.user.id,
            {
                $pull: { friends: req.body.friendId },
            },
            {
                new: true,
            }
        );
        res.status(200).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};
