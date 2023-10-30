const mongoose = require('mongoose');


const category = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    descrpiton : {
        type : String,
        required : false,
    },
    videos : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Videos'
        }
    ]
});

module.exports = mongoose.model('Category', category);