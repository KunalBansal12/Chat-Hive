const jwt=require("jsonwebtoken");
const UserModel = require("../model/UserModel");

const getUserDetailFromToken = async (token)=>{
    if(!token){
        return {
            message: "Session out",
            logout: true
        }
    }

    const decode= jwt.verify(token,process.env.JWT_SECRET_KEY);

    const user=await UserModel.findById(decode.id).select('-password');

    return user;
}

module.exports=getUserDetailFromToken