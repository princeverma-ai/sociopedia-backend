//imports ----------------------------------------------------->
const imgModel = require("../models/imgModel");
const APIFeatures = require("../utils/apiFeatures");

//exports ---------------------------------------------------->
exports.explore = async (req, res) => {
    try {
        //query
        const features = new APIFeatures(imgModel.find(), req.query).paginate().sort();

        //execute query
        const images = await features.query;

        res.status(200).json({
            status: "success",
            results: images.length,
            data: {
                images,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};
