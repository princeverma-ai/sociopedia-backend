//imports ----------------------------------------------------->
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
        select: false,
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
        select: false,
    },
    friends: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    ],
});



//Password encryption ------------------------------------------>
userSchema.pre("save", async function (next) {
    //Only run this function if password was actually modified
    if (!this.isModified("password")) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    return next();
});

//Password verification ---------------------------------------->
userSchema.methods.checkPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

//selecting fields to be returned ------------------------------>
userSchema.pre(/^find/, function (next) {
    this.select("-__v ");
    next();
});

//User model -------------------------------------------------->
const User = mongoose.model("User", userSchema);

//Export User model ------------------------------------------->
module.exports = User;

// {
//     new likes:[{
//         postid: "postid",
//         likes: [userid, userid, userid]
//     },
//     {   
//         postid: "postid",
//         likes: [userid, userid, userid]
//     }]
    
// }


