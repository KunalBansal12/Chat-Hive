const getUserDetailFromToken = require("../helpers/getUserDetailFromToken");

async function UserDetails(req,res){
    try{
        const token = req.cookies.token || "";

        const user=await getUserDetailFromToken(token);

        if (user?.logout) {
            return res.status(401).json({
                message: "Session out",
                data: {
                    logout: true
                }
            });
        }

        return res.status(200).json({
            message: "User details",
            data: user
        });
    } catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports=UserDetails;