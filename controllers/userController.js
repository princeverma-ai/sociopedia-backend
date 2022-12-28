//imports ----------------------------------------------------->
const UserModel = require("../models/userModel");
const imgHandler = require("../utils/imgHandler");
const APIFeatures = require("../utils/apiFeatures");

//Exports ---------------------------------------------------->
exports.getUsers = async (req, res) => {
    try {
        //query
        const features = new APIFeatures(UserModel.find(), req.query).paginate();

        //execute query
        const users = await features.query;

        res.status(200).json({
            status: "success",
            resultsInThisPage: users.length,
            page: req.query.page,
            data: {
                users,
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
exports.getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id).populate({
            path: "posts",
            select: "photo _id",
        });

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
exports.updateUser = async (req, res) => {
    try {
        //if a file is uploaded, upload it to cloudinary
        if (req.file) {
            //get user
            const user = await UserModel.findById(req.params.id);

            let result;

            //if no image present
            if (user.photo.id) {
                //replace image
                result = await imgHandler.replaceImage(req.file, user.photo.id);
            } else {
                //add image
                result = await imgHandler.addImage(req.file);
            }
            req.body.photo = { id: result._id, url: result.secure_url };
        }

        //if photo delete request
        if (req.body.removePhoto) {
            //get user
            const user = await UserModel.findById(req.params.id);

            //delete image
            await imgHandler.deleteImage(user.photo.id);

            //remove photo from user
            req.body.photo = undefined;
        }

        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
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
exports.deleteUser = async (req, res) => {
    try {
        //get user
        const user = await UserModel.findById(req.params.id);

        //delete image
        await imgHandler.deleteImage(user.photo.id);

        //delete user
        await UserModel.findByIdAndDelete(req.params.id);
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
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
