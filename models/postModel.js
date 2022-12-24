//imports ----------------------------------------------------->
const mongoose = require("mongoose");

//Schema ------------------------------------------------------>
const postSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
    },
    photo: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    ],
    comments: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Comment",
        },
    ],
});

// model ----------------------------------------------->
const Post = mongoose.model("Post", postSchema);

//Export model ----------------------------------------------->
module.exports = Post;
