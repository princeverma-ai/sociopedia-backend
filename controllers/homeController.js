//imports ----------------------------------------------------->
const UserModel = require("../models/userModel");
const PostModel = require("../models/postModel");
const APIFeatures = require("../utils/apiFeatures");

//Exports ---------------------------------------------------->
exports.feed = async (req, res) => {
    try {
        //finding the user friends
        const user = await UserModel.findById(req.user.id).select("friends");

        //finding the posts of the user friends
        //query
        const features = new APIFeatures(
            PostModel.find({
                user: { $in: user.friends },
            }).populate("user", "name photo"),
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
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};
