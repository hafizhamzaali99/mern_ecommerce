const User = require('../models/userModel')
const handleAsyncError = require('../middleware/handleAsyncError')

exports.createUser = handleAsyncError(async (req,res,next) =>{
    res.status(201).json('User created successfully')
})