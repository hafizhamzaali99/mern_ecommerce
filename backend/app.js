const cookieParser = require('cookie-parser');
const express = require('express');
const errorMiddleware = require('./middleware/error');
const app = express();

const product = require('./routes/productRoute')
const user = require('./routes/userRoute')

// for using cookies
app.use(cookieParser())

// errror middleware
app.use(errorMiddleware)

app.use(express.json()) // for parsing application/json

// app.use(express.urlencoded({ extended: true }))

// for product 
app.use('/api/v1',product)

// for user
app.use('/api/v1',user)



module.exports = app;