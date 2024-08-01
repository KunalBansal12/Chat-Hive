async function logout(req,res){
    try{
        const cookieOption={
            https: true,
            secure: true,
            expires: new Date(0)
        }

        return res.cookie('token','',cookieOption).status(200).json({
            message: "session out",
            success: true
        })
    } catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports=logout