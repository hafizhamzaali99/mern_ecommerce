const express = require('express');
const errorMiddleware = require('./middleware/error');
const app = express();

const product = require('./routes/productRoute')
const user = require('./routes/userRoute')

app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true }))

// for product 
app.use('/api/v1',product)

// for user
app.use('/api/v1',user)

// errror middleware
app.use(errorMiddleware)

module.exports = app;