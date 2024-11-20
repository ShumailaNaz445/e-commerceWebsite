const nodemailer = require('nodemailer');

const sendResetPassword = async (fname , email , token) => {
    try {
        const transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.MY_GMAIL,
                pass:process.env.MY_PASSWORD,
            },
        })
        const mailOption = {
            from:"",
            to:email,
            subject:"For Reset Password",
            html:`<p> h1 ${fname} , please copy this link <a href = "http://localhost:3000/reset-password?token=${token}"> resetPassword </a> </p>`
        }
        transporter.sendMail(mailOption , (error , info) =>{
            if(error){
                console.log(error);
            } else{
                console.log("mail has sent" , info.response);
                
            }
        })
    } catch (error) {
        res.send({
            error:error.message,
            message:"check your mail"
        })
    }
}

module.exports = sendResetPassword;