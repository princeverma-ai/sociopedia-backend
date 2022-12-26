//imports ----------------------------------------------------->
const OnlineUserModel = require("../models/onlineUserModel");

//exports ---------------------------------------------------->
exports.makeOnline = async (userID, socketID) => {
    try {
        await OnlineUserModel.create({
            userID: userID,
            socketID: socketID,
        });
    } catch (error) {
        return new Error(error);
    }
};

//------------------------------------------------------------>
exports.makeOffline = async (socketID) => {
    try {
        await OnlineUserModel.findOneAndDelete({ socketID: socketID });
    } catch (error) {
        return new Error(error);
    }
};

//------------------------------------------------------------>
exports.checkOnline = async (userID) => {
    try {
        const onlineUser = await OnlineUserModel.findOne({ userID: userID });
        if (onlineUser) {
            return onlineUser;
        } else {
            return false;
        }
    } catch (error) {
        return new Error(error);
    }
};

//------------------------------------------------------------>
exports.getOnlineUsers = async (req, res) => {
    try {
        const onlineUsers = await OnlineUserModel.find();
        res.status(200).json({
            status: "success",
            results: onlineUsers.length,
            data: {
                onlineUsers,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};
