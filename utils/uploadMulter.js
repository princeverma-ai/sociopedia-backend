//imports ----------------------------------------------------->
const multer = require("multer");
const path = require("path");

//config ------------------------------------------------------>
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "tmp"));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + ".png");
    },
});

//multer ------------------------------------------------------>
const multerFunc = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true);
        } else {
            cb(new Error("Not an image! Please upload an image.", 400), false);
        }
    },
});
const singleImageMiddleware = multerFunc.single("img");

//Exports ---------------------------------------------------->
module.exports = singleImageMiddleware;
