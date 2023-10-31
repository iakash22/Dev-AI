const Videos = require('../models/videos');
const User = require('../models/user');
const { uploadImageCloudinary } = require('../utils/imageUploader');
const Category = require('../models/category');

require('dotenv').config();


exports.addVideo = async (req, res) => {
    try {
        const { description, categoryId, tag } = req.body;
        const video = req.files.video;

        if (!description || !categoryId || !tag || !video) {
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            });
        }
        const userId = req.user.id;

        const categoryDetails = await Category.findById(categoryId);

        if (!categoryDetails) {
            return res.status(401).json({
                success: false,
                message: "Category not found"
            });
        }

        const uploadVideo = await uploadImageCloudinary(video, process.env.FOLDER_NAME);
        const videoDetails = await Videos.create({
            url: uploadVideo.secure_url,
            description,
            user: userId,
            category: categoryId,
            tag : tag.toLowerCase().split(",")
        });
        await User.findByIdAndUpdate(
            { _id: userId },
            {
                $push: {
                    videos: videoDetails._id,
                }
            },
            { new: true }
        );

        await Category.findByIdAndUpdate(
            { _id: categoryId },
            {
                $push: {
                    videos: videoDetails._id,
                }
            },
            { new: true },
        );


        return res.status(201).json({
            success: true,
            message: 'Your videos is uploaded',
            data: videoDetails,
        })
    } catch (err) {
        console.log("Error occurred while uploading video", err);
        return res.status(404).json({
            success: false,
            message: err.message,
        });
    }
}

exports.getCategoryBaseVideos = async (req, res) => {
    try {
        const { categoryId } = req.query;
        // console.log(categoryId);
        if (!categoryId) {
            return res.status(501).json({
                success: false,
                message: "category is empty"
            })
        }

        const categoryDetails = await Category.findById({ _id: categoryId })
            .populate({
                path: "videos",
                // populate : {
                //     path : "user"
                // }
            })
            .exec();

        if (!categoryDetails) {
            return res.status(400).json({
                success: false,
                message: "Category is not valid",
            })
        }

        return res.status(201).json({
            success: false,
            message: "Category based videos fetch successful",
            data: categoryDetails,
        });
    } catch (err) {
        console.log("Error occurred while fetch category based videos data", err)
        return res.status(402).json({
            success: false,
            message: err.message,
        })
    }
}

exports.getTagBasedVideos = async (req, res) => {
    try {
        const tag = req.query.tag;

        if (!tag) {
            return res.status(501).json({
                success: false,
                message: "tag is empty"
            })
        }
        const newTag = tag.toLowerCase();


        const videos = await Videos.find({ tag: {$in : [newTag]} }).populate('user'); // You can populate the 'user' field if needed

        if (videos.length === 0) {
            return res.status(404).json({ message: 'No videos found with the specified tag.',data : videos });
        }
        return res.status(201).json({
            success: false,
            message: "Tag based videos fetch successful",
            data: videos,
        });
    } catch (err) {
        console.log("Error occurred while fetch tag based videos data", err)
        return res.status(402).json({
            success: false,
            message: err.message,
        })
    }
};

exports.getAllVideos = async (req, res) => {
    try {
        const videosData = await Videos.find().populate('User').exec();

        if (!videosData) {
            return res.status(400).json({
                success: false,
                message: "Not Found",
            })
        }

        return res.status(201).json({
            success: false,
            message: "Videos fetch successful",
            data: videosData,
        })
    } catch (err) {
        console.log("Error occurred while fetch videos data")
        return res.status(402).json({
            success: false,
            message: err.message,
        })
    }
}

