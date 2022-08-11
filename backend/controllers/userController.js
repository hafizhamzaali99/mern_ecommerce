const User = require('../models/userModel')
const handleAsyncError = require('../middleware/handleAsyncError')
const getToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')



exports.createUser = handleAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body
    const user = await User.create({
        name, email, password,
        avatar: {
            public_ID: "this is profile id",
            url: "profilepicurl"
        }
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
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')
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
    if (req.body.password !== req.body.confirmPassword) {
        res.status(404).json({
            success: false,
            message: "Password does not match"
        })
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    getToken(user,200,res)
})