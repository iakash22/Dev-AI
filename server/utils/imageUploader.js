const cloudinary = require('cloudinary').v2;


exports.uploadImageCloudinary = async (file, folder, height, quality) => {
    try {
        const options = { folder };
        if (height) options.height = height;
        if (quality) options.quality = quality;

        options.resource_type = "auto";

        const res = await cloudinary.uploader.upload(file.tempFilePath, options);
        // console.log(res);
        return res;
    }catch(err){
        return err.message;
    }    
}