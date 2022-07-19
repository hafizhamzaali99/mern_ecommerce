const express = require('express');
const app = express();

const product = require('./routes/productRoute')

app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true }))

app.use('/api/v1',product)

module.exports = app;