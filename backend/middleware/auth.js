const handleAsyncError = require("./handleAsyncError");
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


exports.isAuthenticatedUser = handleAsyncError( async (req,res,next)=>{
    const {token} = req.cookies
    if (!token){
        res.status(401).json({
            success:false,
            message:"Please login first"
        });
        // res.send({status: false, msg: "Unauthorize"})
    }else{
        const decodeData = jwt.verify(token,process.env.JWT_SECRET)
        console.log(decodeData)
        req.user = await User.findById(decodeData.id)
        next()
    }
    
})