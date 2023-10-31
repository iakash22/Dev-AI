const Videos = require('../models/videos');
const { default: mongoose } = require('mongoose');

exports.addLike = async (req, res) => {
    try {
        const { videoId } = req.body;
        const userId = req.user.id;
        const checkLike = await Videos.findOne(
            {
                _id: videoId,
                like: {
                    $elemMatch: { $eq: userId }
                }
            }
        );

        console.log("checkLike: ", checkLike);

        if (checkLike) {
            return res.status(402).json({
                message: "You are already like",
                data: checkLike
            });
        }

        const videosDetails = await Videos.findByIdAndUpdate({ _id: videoId }, {
            $push: {
                like: userId,
            }
        }, { new: true })

        if (!videosDetails) {
            return res.status(500).josn({
                success: false,
                message: "Details not fetch for like"
            })
        }

        return res.status(201).json({
            success: true,
            message: 'Add like',
            videosDetails
        })
    } catch (err) {
        console.log("Error occurred while Add like", err);
        return res.status(404).json({
            success: false,
            message: err.message,
        });
    }
}

exports.removeLike = async (req, res) => {
    try {
        const { videoId } = req.body;
        const userId = req.user.id;

        const checkLike = await Videos.findOne(
            {
                _id: videoId,
                like: {
                    $elemMatch: { $eq: userId }
                }
            }
        );

        if (!checkLike) {
            return res.status(402).json({
                message: "You are not like this video",
                data: checkLike
            });
        }

        const videosDetails = await Videos.findByIdAndUpdate({ _id: videoId }, {
            $pull: {
                like: userId,
            }
        }, { new: true });

        if (!videosDetails) {
            return res.status(500).josn({
                success: false,
                message: "Details not fetch for like"
            })
        }

        return res.status(201).json({
            success: true,
            message: 'Remove like',
            videosDetails
        })
    } catch (err) {
        console.log("Error occurred while Remove like", err);
        return res.status(404).json({
            success: false,
            message: err.message,
        });
    }
}