const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
        minLength: [8, "Password should have more than 8 characters"],
        select: false
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

// for bcrypting password

userModel.pre("save", async function(next){
    // if user just update name and email but not password so password is already bcrypt and it will also update hash password so for thatwe make this  
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
})

// for JWTToken

userModel.methods.getJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRY
    })
}

// password comparision

userModel.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}




module.exports = mongoose.model('users', userModel)