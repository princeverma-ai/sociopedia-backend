//imports ----------------------------------------------------->
const mongoose = require("mongoose");

//Schema ------------------------------------------------------>
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
    },
    photo: {
        type: String,
    },
    bio: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

//User model -------------------------------------------------->
const User = mongoose.model("User", userSchema);

//Export User model ------------------------------------------->
module.exports = User;
