const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSKEY,
  },
});

async function sendOTPEmail(email, otp) {
  try{
    const info =await transporter.sendMail({
      from: 'Chat Hive <chathiveotp@gmail.com>',
      to: `<${email}>`,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. Please do not share OTP with anyone.`,
    });
    // console.log(info.response)  
  } catch(err){
    console.log("Error sending mails",err)
  }
}

module.exports = sendOTPEmail;
