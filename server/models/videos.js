const mongoose = require('mongoose');

const videos = new mongoose.Schema({
    url : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    category : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Category'
        }
    ],
    userId : [{     
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }],
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

module.exports = mongoose.model('Videos',)