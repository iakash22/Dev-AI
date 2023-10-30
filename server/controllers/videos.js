const Videos = require('../models/videos');
const User = require('../models/user');
const uploadImageCloudinary = require('../utils/imageUploader');
const Category = require('../models/category');

require('dotenv').config();


exports.videos = async(req,res) => {
    try{
        const {description,category,tag} = req.body;
        const video = req.files.video;
        
        if(!description || !category || !tag || !video){
            return res.status(401).json({
                success : false,
                message : "All fields are required"
            });
        }
        const userId = req.user.id;

        const categoryDetails = await Category.findById(category);

        if(!categoryDetails){
            return res.status(401).json({
                success : false,
                message : "Category not found"
            });
        }

        const uploadVideo = await uploadImageCloudinary(thumbnail, process.env.FOLDER_NAME);
        const videoDetails = await Videos.create({
            url : uploadVideo.secure_url,
            description,
            user : userId,
            category : category,
            tag : tag,
        });
        await User.findByIdAndUpdate(
            {_id : userId},
            {
                $push : {
                    videos : videoDetails._id,
                }
            },
            {new : true}
        );

        await Category.findByIdAndUpdate(
            {_id : category},
            {
                $push : {
                    videos : videoDetails._id,
                }
            },
            {new : true},
        );


        return req.status(201).json({
            success: true,
            message : 'Your videos is uploaded',
            data : videoDetails,
        })
    }catch(err){
        console.log("Error occurred while uploading video", err);
        return res.status(404).json({
            success : false,
            message : err.message,
        });
    }
}