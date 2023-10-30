const nodemailer = require('nodemailer');
require('dotenv').config;

const emailSender = async(email, title, body) => {
    try{
        let transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            auth : {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from : 'DEV JOB AI',
            to : `${email}`,
            subject : `${title}`,
            html : `${body}`,
        });

        return info;
        
    }catch(err){
        console.log(err);
    }
}  

module.exports = emailSender;