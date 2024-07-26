const UserModel = require("../model/UserModel");

async function checkEmail(req,res){
    try{
        const {email}=req.body;

        const checkemail= await UserModel.findOne({email}).select("-password");

        if(!checkemail){
            return res.status(400).json({
                message: "User does not exist",
                error: true
            })
        }

        return res.status(200).json({
            message: "Email verified",
            success: true,
            data: checkemail
        })

    } catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports=checkEmail;