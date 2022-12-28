//imports ----------------------------------------------------->
const APIFeatures = require("../utils/apiFeatures");
const PostModel = require("../models/postModel");

//exports ---------------------------------------------------->
exports.explore = async (req, res) => {
    try {
        //query
        const features = new APIFeatures(PostModel.find(), req.query).paginate().sort();

        //execute query
        const images = await features.query.select("photo _id");

        res.status(200).json({
            status: "success",
            results: images.length,
            data: {
                images,
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
