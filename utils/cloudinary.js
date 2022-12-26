//imports ----------------------------------------------------->
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

//config ------------------------------------------------------>

cloudinary.config({
    cloud_name: "dr4ej5xfu",
    api_key: "412197463159899",
    api_secret: "967t8Vt6h8cDbKhEi9PQvlaXuws",
});
console.log("Cloudinary config loaded");
//del file local--------------------------------------------->
const delFileLocal = (file) => {
    console.log(`Deleting file ${file.filename} from local storage`);
    fs.unlink(path.join(__dirname, "..", "tmp", file.filename), (err) => {
        if (err) {
            throw new Error(`Could not delete file : ${err}`);
        }
    });
};

//Upload ---------------------------------------------------->
const uploadCloudinary = async (file) => {
    try {
        console.log("file upload started");
        console.log("file upload from path:", path.join(__dirname, "..", "tmp", file.filename));
        //upload file to cloudinary
        const result = await cloudinary.uploader.upload(
            path.join(__dirname, "..", "tmp", file.filename)
        );
        console.log("file upload completed");

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
