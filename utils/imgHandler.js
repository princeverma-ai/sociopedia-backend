//imports ----------------------------------------------------->
const imgModel = require("../models/imgModel");
const { uploadCloudinary, deleteCloudinary } = require("../utils/cloudinary");

//------------------------------------------------------------>

const addImageDataToDB = async (file, data) => {
    try {
        const imgOject = {
            asset_id: data.asset_id,
            public_id: data.public_id,
            signature: data.signature,
            width: data.width,
            height: data.height,
            size: data.bytes,
            filename: data.original_filename,
            root_filename: file.originalname,
            secure_url: data.secure_url,
        };
        const img = await imgModel.create(imgOject);
        return img;
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
};

const deleteImageFromDB = async (id) => {
    try {
        const img = await imgModel.findByIdAndDelete(id);
        return img;
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
};

//------------------------------------------------------------>
exports.addImage = async (file) => {
    try {
        //try to upload file to cloudinary
        const result = await uploadCloudinary(file);

        //if upload is successful add image data to db
        const img = await addImageDataToDB(file, result);

        //return image data
        return img;
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
};

//------------------------------------------------------------>
exports.deleteImage = async (id) => {
    try {
        //get image data from db
        const img = await imgModel.findById(id);

        //delete image from cloudinary
        await deleteCloudinary(img.public_id);

        //delete image from db
        await deleteImageFromDB(id);

        return img;
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
};

//------------------------------------------------------------>
exports.replaceImage = async (file, old_image_id) => {
    try {
        //get image data from db
        const img = await imgModel.findById(old_image_id);

        //delete image from cloudinary
        await deleteCloudinary(img.public_id);

        //delete image from db
        await deleteImageFromDB(old_image_id);

        //try to upload file to cloudinary
        const result = await uploadCloudinary(file);

        //if upload is successful add image data to db
        const newImg = await addImageDataToDB(file, result);

        //return image data
        return newImg;
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
};
