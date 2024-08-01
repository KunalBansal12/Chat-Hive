const express=require("express");
const registerUser = require("../controller/registerUser");
const checkEmail = require("../controller/checkEmail");
const checkPassword = require("../controller/checkPassword");
const logout = require("../controller/logout");
const updateUserDetails = require("../controller/updateUserDetails");
const UserDetails = require("../controller/UserDetails");
const searchUser = require("../controller/searchUser");
const {send_otp, verify_otp} = require("../controller/send_otp");
const newPassword = require("../controller/newPassword");

const router=express.Router();

router.post('/register',registerUser)
// check user email
router.post('/email',checkEmail)
// check user password
router.post('/password',checkPassword)
// login user details
router.get('/user-details',UserDetails)
// logout user
router.get('/logout',logout)
// update user details
router.put('/update-user',updateUserDetails)
// search user
router.post('/search-user',searchUser)
// send_otp
router.post('/send_otp',send_otp)
// verify otp
router.post('/verify_otp',verify_otp)
// forgot password
router.put('/new-password',newPassword)

module.exports = router