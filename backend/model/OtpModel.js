const mongoose=require('mongoose')

const otpSchema=new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    createdAt: {type: Date, expires: 300, default: Date.now}
});

const OtpModel=mongoose.model('OtpModel',otpSchema);

module.exports=OtpModel;