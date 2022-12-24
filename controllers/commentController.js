//imports ----------------------------------------------------->
const ComentModel = require("../models/commentModel");

//Exports ---------------------------------------------------->
exports.createComment = async (req) => {
    try {
        const commentObject = {
            text: req.body.text,
            user: req.user.id,
            post: req.params.id,
        };

        const comment = await ComentModel.create(commentObject);

        return comment;
    } catch (error) {
        return new Error(error);
    }
};

//Exports ---------------------------------------------------->
exports.deleteComment = async (id) => {
    try {
        const comment = await ComentModel.findByIdAndDelete(id);

        return comment;
    } catch (error) {
        return new Error(error);
    }
};
