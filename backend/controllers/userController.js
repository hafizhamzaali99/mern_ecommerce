const User = require('../models/userModel')
const handleAsyncError = require('../middleware/handleAsyncError')
const getToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')



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

// for reset password 

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
    console.log(resetToken)

    await user.save({ validateBeforeSave: false })

    //link to send in email 

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    // message to send in email 

    const message = `Your password reset token is \n\n ${resetUrl} if you have not requested this email then, please ignore it`

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