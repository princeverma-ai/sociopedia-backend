//imports ----------------------------------------------------->
const UserModel = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");

//Exports ---------------------------------------------------->
exports.search = async (req, res) => {
    try {
        //searching user
        //query
        const features = new APIFeatures(
            UserModel.find({
                name: {
                    $regex: req.query.name,
                    $options: "i",
                },
            }),
            req.query
        ).paginate();

        //execute query
        const users = await features.query.select("name email _id photo bio");

        res.status(200).json({
            status: "success",
            resultsInThisPage: users.length,
            page: req.query.page,
            data: {
                users,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};
