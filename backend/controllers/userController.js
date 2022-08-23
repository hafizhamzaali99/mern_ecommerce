const User = require('../models/userModel')
const handleAsyncError = require('../middleware/handleAsyncError')
const getToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const ErrorHandler = require('../utils/errorHandler')



exports.createUser = handleAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body
    const user = await User.create({
        name, email, password,
        avatar: {
            public_ID: "this is profile id",
            url: "profilepicurl"
        }
    }).catch((err) => {
        next( new ErrorHandler(404, err.message) )
    })

    getToken(user, 201, res)

})

//login user

exports.loginUser = handleAsyncError(async (req, res) => {
    const { email, password } = req.body

    //checking is user enter email and password
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: "'Please Enter Email and Password'"
        })
    }

    const user = await User.findOne({ email }).select('+password')
    // console.log(user)
    if (!user) {
        res.status(401).json({
            success: false,
            message: "Invalid email and password"
        })
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        res.status(401).json({
            success: false,
            message: "Invalid email and password"
        })
    }
    getToken(user, 200, res)
    // let token_options = getToken(user);
    // token = token_options[0];
    // options = token_options[1];

    // // res.cookie('token',token, options).status(200).json({
    // //     success: true,
    // //     user
    // // })
    // res.cookie('token',token, options).status(204).json({"message": "lol"})

})

// for logout user

exports.logoutUser = handleAsyncError(async (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logout successfully"
    })
})

// for forgot password 

exports.forgotPassword = handleAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return (
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        )
    }
    const resetToken = user.getResetPasswordToken()
    // console.log(resetToken)

    await user.save({ validateBeforeSave: false })

    //link to send in email 

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/user/reset/${resetToken}`
    // message to send in email 

    const message = `Your password reset token is \n\n ${resetUrl} \n\n if you have not requested this email then, please ignore it`

    try {
        await sendEmail({
            email: user.email,
            subject: "E-com Reset Password",
            message
        })
        res.status(200).json({
            success: true,
            message: `Email send to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        user.save({ validateBeforeSave: false })
        return (
            res.status(500).json(error.message)
        )
    }

})


// for reset password

exports.resetPassword = handleAsyncError(async (req, res, next) => {
    const token = req.params.token
    console.log(token)
    //first hashing token with crypto
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')

    console.log(resetPasswordToken)
    //finding user with token 
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        res.status(404).json({
            succes: false,
            message: "Reset password token is invalid or expire"
        })
    }

    //to check that user enter same password and confirm password
    if (req.body.password !== req.body.confirmPassword) {
        res.status(404).json({
            success: false,
            message: "Password does not match"
        })
    }


    // if user found by checking with token in database  and pass and confPass alsom same then set pass to database and empty the resetPassword Token and expire field 
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    // to save the document
    await user.save()
    //after change password login user by sending token in cookie
    getToken(user, 200, res)
})

// get user details (own)

exports.getUserDetails = handleAsyncError( async (req,res,next)=>{
    const user = await User.findById(req.user.id) 
    res.status(200).json({
        succes:true,
        user
    })
})


// update user password

exports.updatePassword = handleAsyncError( async (req,res,next)=>{
    // firstly find user with id which is save in req.user.id on the auth function  
    const user = await User.findById(req.user.id).select('+password')

    // after compare user password and req.body.oldPassword
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

    if (!isPasswordMatched) {
        res.status(400).json({
            success: false,
            message: "Old password is invalid"
        })
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        res.status(400).json({
            success: false,
            message: "Password does not match"
        })
    }
    // to check save password and new password is not same 
    if(user.password == req.body.newPassword){
        res.status(400).json({
            success: false,
            message: "please enter a different password"
        })
    }
    user.password = req.body.newPassword
    
    // to save user information in document
    await user.save()

    getToken(user,200,res)
})


// update user profile

exports.updateProfile = handleAsyncError( async (req,res,next)=>{
    // const getNewData = {
    //     name:req.body.name,
    //     email:req.body.email,
    // }
    const {name,email} = req.body
    // firstly find user with id which is save in req.user.id on the auth function  
    const user = await User.findByIdAndUpdate(req.user.id,{name,email},{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success: true,
        user
    })
})

// get all user (admin)

exports.getAllUsers = handleAsyncError(async (req, res,next)=>{
    const users = await User.find()
    if(!users){
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }
    res.status(200).json({
        success: true,
        users
    })
})  
// get single user (admin)

exports.getSingleUser = handleAsyncError(async (req, res,next)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }
    res.status(200).json({
        success: true,
        user
    })
})  

// update profile (admin)

exports.updateUserProfile = handleAsyncError( async (req,res,next)=>{
    // const getNewData = {
    //     name:req.body.name,
    //     email:req.body.email,
    // }
    const {name,email,role} = req.body
    const user = await User.findByIdAndUpdate(req.params.id,{name,email,role},{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success: true,
        user
    })
})

// delete user profile admin

exports.deleteUserProfile = handleAsyncError( async (req,res,next)=>{

    const user = await User.findById(req.params.id)
    if(!user){
        return res.status(404).json({
            success: false,
            message: "User does not exist"
        })
    }
    await user.remove()

    res.status(200).json({
        success: true,
        message:"User has been successfully deleted"
    })
})

// PRODUCT REVIEWS FUNCTION REMAINING
