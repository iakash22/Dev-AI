const mongoose = require('mongoose');


const user = new mongoose.Schema({
    userName :  {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    accountType : {
        type : String,
        required :  true,
        enum : ["Register", "Unregister"]
    },
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    image : {
        type : String,
        required : true,
    },
    videos : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Videos"
        }
    ],
});


module.exports = mongoose.model('User', user);