// token creating function and saving in cookie

const getToken = (user,statusCode,res) =>{
    const token = user.getJWTToken()

    //option for cookies
    const options = {
        expiress:new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly:true,
    }

    // let token_options = [];
    // token_options[0] = token;
    // token_options[1] = options;

    // return token_options;

    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        user,
        token,
    })
}

module.exports = getToken;