const express = require('express');
const errorMiddleware = require('./middleware/error');
const app = express();

const product = require('./routes/productRoute')

app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true }))

app.use('/api/v1',product)

// errror middleware
app.use(errorMiddleware)

module.exports = app;