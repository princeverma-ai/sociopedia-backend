//imports ----------------------------------------------------->
const mongoose = require("mongoose");

//schema ------------------------------------------------------>
const imgSchema = new mongoose.Schema({
    asset_id: {
        type: String,
    },
    public_id: {
        type: String,
    },
    signature: {
        type: String,
    },
    width: {
        type: String,
    },
    height: {
        type: String,
    },
    size: {
        type: String,
    },
    filename: {
        type: String,
    },
    root_filename: {
        type: String,
    },
    secure_url: {
        type: String,
    },
});

// model ----------------------------------------------->
const Img = mongoose.model("Img", imgSchema);

//Export model ----------------------------------------------->
module.exports = Img;
