//imports ----------------------------------------------------->
const mongoose = require("mongoose");

//schema ------------------------------------------------------>
const onlineUserSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.ObjectId,
    },
    socketID: {
        type: String,
    },
});

//model ----------------------------------------------->
const OnlineUser = mongoose.model("OnlineUser", onlineUserSchema);

//Export model ----------------------------------------------->
module.exports = OnlineUser;
