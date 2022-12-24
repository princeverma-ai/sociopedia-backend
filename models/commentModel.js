//imports ----------------------------------------------------->
const mongoose = require("mongoose");

//Schema ------------------------------------------------------>
const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
    },
});

// model ----------------------------------------------->
const Comment = mongoose.model("Comment", commentSchema);

//Export model ----------------------------------------------->
module.exports = Comment;
