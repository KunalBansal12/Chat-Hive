const sendOTPEmail = require("../helpers/emailService");
const crypto=require('crypto');
const OtpModel = require("../model/OtpModel");

async function send_otp(req,res){
    try{
        const {email}=req.body;

        if(!email || !validateEmail(email)){
            return res.status(400).json({
                message: "Invalid email address",
                error: true
            })
        }

        const otp=crypto.randomInt(100000, 999999).toString();
        await OtpModel.deleteOne({email:email});

        await sendOTPEmail(email,otp);
        const newotp=new OtpModel({
            email:email,
            otp: otp,
            createdAt: new Date()
        });
        const otpsave=await newotp.save();

        return res.status(200).json({
            message: 'OTP sent to your email address',
            success:true
        });
    } catch(err){
        return res.status(400).json({
            message: err,
            error: true
        })
    }
}

async function verify_otp(req,res){
    try{
        const {email,otp}=req.body;
        const savedotp=await OtpModel.findOne({email: email});
        if(!savedotp){
            return res.status(400).json({
                message: "Otp has expired, create new one",
                error: true
            });
        }

        if(savedotp.otp!=otp){
            return res.status(400).json({
                message: "Wrong otp",
                error: true
            });
        }

        const del=await OtpModel.deleteOne({email:email})
        return res.status(200).json({
            message: "Otp verified",
            success: true
        });
    } catch(err){
        return res.status(400).json({
            message: "Failed to verify otp",
            error: true
        })
    }
}

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

module.exports={
    send_otp,
    verify_otp
};