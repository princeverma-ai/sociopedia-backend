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
      path.join(__dirname, "..", "tmp", file.filename),
      {
        folder: "socioPedia",
      }
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
