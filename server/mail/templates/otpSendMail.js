exports.otpSendMail = (otp) => {
    return`<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Course Registration Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }  
    
            .container {
                font-family: Helvetica,Arial,sans-serif;
                min-width:1000px;
                overflow:auto;
                line-height:2
            }
            .inner-container{
                margin:50px auto;
                width:70%;
                padding:20px 0;
            }
            a{
                font-size:1.4em;
                color: #00466a;
                text-decoration:none;
                font-weight:600;
            }
            .link-box{
                border-bottom:1px solid #eee;
            }
            .para-1{
                font-size:1.1em;
            }
            h2{
                background: #00466a;
                margin: 0 auto;
                width: max-content;
                padding: 0 10px;
                color: #fff;
                border-radius: 4px;
            }
            .para-2{
                font-size:0.9em;
            }
            hr{
                border:none;
                border-top:1px solid #eee;
            }
            .ref{
                float:right;
                padding:8px 0;
                color:#aaa;
                font-size:0.8em;
                line-height:1;
                font-weight:300;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container" >
            <div class="inner-container">
                <div class="link-box">
                    <a href="#">DEV JOB AI</a>
                </div>
                <p class="para-1" >Hi,</p>
                <p>Thank you for choosing Your DEV JOB AI. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
                <h2>${otp}</h2>
                <p class="para-2">Regards,<br />DEV JOB AI</p>
                <hr/>
                <div class="ref">
                    <p>Your DEV JOB AI Inc</p>
                    <p>11/55 Samli</p>
                    <p>Banglore</p>
                </div>
            </div>
        </div>
    </body>
    
    </html>`;
};