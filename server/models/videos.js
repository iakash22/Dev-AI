const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    url : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category'
    },
    user : {     
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    tag : {
        type : [String],
        required : true,
    },
    like : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
})

module.exports = mongoose.model('Videos', videoSchema)