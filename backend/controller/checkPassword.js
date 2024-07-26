const UserModel=require('../model/UserModel');
const bcryptjs = require("bcryptjs");
const jwt=require("jsonwebtoken");

async function checkPassword(req,res){
    try{
        const {password, userId}=req.body;

        const user=await UserModel.findById(userId)
        console.log(user)
        console.log(password)

        bcryptjs.compare(password,user.password,function(err,data){
            if(err){
                return res.status(500).json({
                    message: err.message || err,
                    error: true
                })
            }
            if(data){
                const tokenData={
                        id: user._id,
                        email: user.email
                    }
                    const token=jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn: '1d'});
            
                    const cookieOption={
                        https: true,
                        secure: true
                    }
            
                    return res.cookie('token',token,cookieOption).status(200).json({
                        message: "Logged in successfully",
                        token: token,
                        success: true
                    })
            } else{
                return res.status(400).json({
                            message: "Please check your password",
                            error: true
                        })
            }
        });

        // if(!verifyPassword){
        //     return res.status(400).json({
        //         message: "Please check your password",
        //         error: true
        //     })
        // }

        // const tokenData={
        //     id: user._id,
        //     email: user.email
        // }
        // const token=jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn: '1d'});

        // const cookieOption={
        //     https: true,
        //     secure: true
        // }

        // return res.cookie('token',token,cookieOption).status(200).json({
        //     message: "Logged in successfully",
        //     token: token,
        //     success: true
        // })

    } catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports=checkPassword