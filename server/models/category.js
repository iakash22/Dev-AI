const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    description : {
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

module.exports = mongoose.model('Category', categorySchema);