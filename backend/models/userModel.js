const mongoose = require('mongoose')
const validator = require('validator')

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the name"],
        maxLength: [30, "Name can't exceed to 30 characters"],
        minLength: [4, "Name should have more tha 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter the email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [4, "Password should have more than 8 characters"],
        seclect: false
    },
    avatar: {
        public_ID: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date

})

module.exports = mongoose.model('users', userModel)