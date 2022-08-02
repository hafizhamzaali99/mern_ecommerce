const User = require('../models/userModel')
const handleAsyncError = require('../middleware/handleAsyncError')

exports.createUser = handleAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body
    const user = await User.create({
        name, email, password,
        avatar: {
            public_ID: "this is profile id",
            url: "profilepicurl"
        }
    })

    const token = user.getJWTToken()

    res.status(201).json({
        success: true,
        token
    })
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

    if (!user) {
        res.status(401).json({
            success: false,
            message: "'Invalid email and password'"
        })
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        res.status(401).json({
            success: false,
            message: "'Invalid email and password'"
        })
    }

    const token = user.getJWTToken()

    res.status(200).json({
        success: true,
        token
    })
})