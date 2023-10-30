const OTP = require('../models/OTP');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
// const emailSender = require('../utils/emailSender');
// const { passwordUpdated } = require("../mail/templates/passwordUpdate");

require('dotenv').config();

// send otp 
exports.sendotp = async (req, res) => {
    try {
        // fetch email from body
        const { email } = req.body;

        // check user already register or not 
        const checkUserExist = await User.findOne({ email });

        // if registered return res 
        if (checkUserExist) {
            return res.status(401).json({
                success: false,
                message: "User already registered"
            })
        };

        // not registered generate otp
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("Generated OTP: ", otp);

        // check otp is already exist or not  
        const result = await OTP.findOne({ otp });

        // check and generate unique otp  
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

            result = await OTP.findOne({ otp });
        };

        // create an entry in otp db
        const otpBody = await OTP.create({ email, otp });
        console.log(otpBody);

        // return response successful
        return res.status(201).json({
            success: true,
            message: "Otp sent successfully",
            otp,
        });

    } catch (err) {
        console.log("Error occurred while sent otp", err);
        return res.status(404).json({
            success: false,
            message: err.message,
        });
    }
};


exports.signup = async (req, res) => {
    try {
        // data fetch in request body  
        const {
            accountType,
            userName,
            email,
            password,
            confirmPassword,
            otp,
        } = req.body;

        // validation

        console.log(req.body);

        //  check all fields are fill or not 
        if (!userName || !email || !password || !confirmPassword || !otp) {
            return res.status(401).json({
                success: false,
                message: "Fill all fields",
            });
        }

        // check password and confirmPassword are equal 
        if (password != confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirmPassword does not match, please try again",
            });
        }

        // check user already exist or not 

        const checkUserExist = await User.findOne({ email });

        if (checkUserExist) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            })
        }

        //find most recently otp
        const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log("recentOTP", recentOTP);

        // otp validation 
        if (recentOTP.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Otp not found",
            })
        }
        else if (recentOTP[0].otp != otp) {
            // Invalid Otp 
            console.log(recentOTP[0].otp, otp)
            return res.status(401).json({
                success: false,
                message: "Invalid OTP",
            })
        }

        // hash password 
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName, email, password: hashPassword,
            accountType,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${userName[0]} ${userName[1]}`
        });

        return res.status(201).json({
            success: true,
            message: "User register successfully",
            user,
        });

    } catch (err) {
        console.log("Error occurred while signup", err);
        return res.status(404).json({
            success: false,
            message: "User cannot be registered, please try again later"
        });
    }
}

exports.login = async (req, res) => {
    try {
        // fetch data from body 
        const { email, password } = req.body;

        // Check if email or password is missing
        if (!email || !password) {
            // Return 400 Bad Request status code with error message
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            });
        }

        // check user exist or not
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user is not register, please signup first"
            })
        }

        if (await bcrypt.compare(password, user.password)) {
            // create palyload of jwt 
            const payload = {
                email,
                accountType: user.accountType,
                id: user._id,
            }

            // create JsonWebToken 
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn: '2h',
            })

            user.token = token;
            user.password = undefined;

            const options = {
                expire: new Date(Date.now + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            // return successful response with cookies in token 
            return res.cookie("token", token, options).status(201).json({
                success: true,
                message: "User login successfully",
                user,
            });
        } else {
            return res.status(402).json({
                success: false,
                message: "Password incorrect",
            });
        }
    } catch (err) {
        console.log("error occurred while login", err);
        // Return 500 Internal Server Error status code with error message
        return res.status(500).json({
            success: false,
            message: "User login failure, please try again",
        })
    }
}

// exports.changePassword = async (req, res) => {
//     try {
//         const { currentPassword, newPassword, confirmNewPassword } = req.body;
//         const id = req.user.id;

//         if (!id) {
//             return res.status(402).json({
//                 success: false,
//                 message: "User id is missing",
//             })
//         }
//         // console.log(req.body);

//         // validation 
//         if (!currentPassword || !newPassword || !confirmNewPassword) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Fill all fields",
//             });
//         }

//         //check user exist
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "user is not register, please signup first"
//             })
//         }

//         // check currentPassword is correct or not
//         if (await bcrypt.compare(currentPassword, user.password)) {

//             // check newPassword and confirmNewPassword are equal match or not 
//             if (newPassword != confirmNewPassword) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Password and confirmPassword does not match, please try again",
//                 });
//             } else {
//                 // hash new password 
//                 const hashPassword = await bcrypt.hash(newPassword, 10);

//                 // update new hashpassword in db 
//                 const newUser = await User.findOneAndUpdate({ _id: id }, { password: hashPassword }, { new: true });
//                 const sendEmail = await emailSender(user.email, "Password Update", passwordUpdated(
//                     user.email,
//                     `Password updated successfully for ${user.firstName} ${user.lastName}`
//                 ));
//                 console.log("send mail for update password", sendEmail);

//                 return res.status(200).json({
//                     success: true,
//                     message: "Password change successfully",
//                     data: newUser,
//                 });
//             }
//         } else {
//             // old password incorrect 
//             return res.status(401).json({
//                 success: false,
//                 message: "Incorrect Old password",
//             });
//         }
//     } catch (err) {
//         console.log("error occurred while change password", err);
//         return res.status(404).json({
//             success: false,
//             message: "Password does not change, please try again",

//         });
//     }
// }