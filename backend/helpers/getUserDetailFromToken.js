const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel");

const getUserDetailFromToken = async (token) => {
    if (!token) {
        return {
            message: "Session out",
            logout: true
        };
    }
    else{
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await UserModel.findById(decode.id).select('-password');
            return user;
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return {
                    message: "Session out",
                    logout: true
                };
            } else {
                throw error;
            }
        }
    }
};

module.exports = getUserDetailFromToken;
