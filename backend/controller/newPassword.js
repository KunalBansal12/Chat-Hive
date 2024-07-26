const UserModel = require("../model/UserModel");
const bcryptjs=require('bcryptjs')

const newPassword=async (req,res)=>{
    try{
        const {userId,password}=req.body;

        const salt = await bcryptjs.genSalt(10);
        const hashpassword=await bcryptjs.hash(password,salt);
        const upd=await UserModel.updateOne({_id:userId},{password: hashpassword});

        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        })
    } catch(err){
        return res.status(500).json({
            message: err.message || err,
            error: true
        })
    }

}

module.exports=newPassword