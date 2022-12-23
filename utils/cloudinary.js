//imports ----------------------------------------------------->
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");

//config ------------------------------------------------------>
dotenv.config({ path: "./config.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//del file local--------------------------------------------->
const delFileLocal = (file) => {
    fs.unlink(path.join(__dirname, "..", "tmp", file.filename), (err) => {
        if (err) {
            throw new Error(`Could not delete file : ${err}`);
        }
    });
};

//Upload ---------------------------------------------------->
const uploadCloudinary = async (file) => {
    try {
        //upload file to cloudinary
        const result = await cloudinary.uploader.upload(
            path.join(__dirname, "..", "tmp", file.filename)
        );

        //delete file after uploading
        delFileLocal(file);

        return result;
    } catch (error) {
        //also delete file if upload fails
        delFileLocal(file);
        return new Error(`Could not upload file to cloudinary: ${error}`);
    }
};

//delete file from cloudinary------------------------------->
const deleteCloudinary = async (public_id) => {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        return result;
    } catch (error) {
        return new Error(`Could not delete file from cloudinary: ${error}`);
    }
};
//Exports ---------------------------------------------------->
exports.uploadCloudinary = uploadCloudinary;
exports.deleteCloudinary = deleteCloudinary;
