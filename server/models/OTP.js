const mongoose = require('mongoose');
const emailSender = require('../utils/emailSender');
const {otpSendMail} = require('../mail/templates/otpSendMail');


const otp = new mongoose.Schema({
    otp : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    createdAt : {
        type : String,
        default : Date.now(),
        expire : 5*60,
    }
})


const sendVerfication = async(email, otp) => {
    try{
        const mailResponse = await emailSender(email, "studyNotion - confirmation code",otpSendMail(otp));
        console.log(mailResponse);
    }catch(err){
        console.log('Error occured while sending mails: ', err);
        throw err;
    }
};

otp.pre("save", async function(next){
    await sendVerfication(this.email, this.otp);
    next();
});




module.exports = mongoose.model("OTP", otp);