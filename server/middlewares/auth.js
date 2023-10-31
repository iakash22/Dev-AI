const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.auth = async (req, res,next) => {
    try {
        const token = req.cookies.token
            || req.body.token
            || req.header("Authorisation").replace("Bearer ", "");
            
            if (!token) {
                return res.status(401).json({
                    success: true,
                    message: "Token is missing",
                })
            }
            
            try {
                const decode = jwt.verify(token, process.env.SECRET_KEY);
                console.log(decode);
                req.user = decode;

        } catch (err) {
            // verification issues 
            return res.status(400).json({
                success: false,
                message: "token is Invalid",
            });
        }
        next();
    } catch (err) {
        console.log("error occurred while auth middleware", err);
        return res.status(404).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
}

exports.register = async (req, res,next) => {
    try {
        const { accountType } = req.user;
        if (accountType != "Register") {
            return res.status(404).json({
                success: false,
                message: "This is a protected route for Unregister user"
            })
        }
        next();
    } catch(err){
        console.log("Error occurred while register check", err);
        return res.status(400).json({
            success : false,
            message : "User role cannot be verified, please try again"
        });
    }
}